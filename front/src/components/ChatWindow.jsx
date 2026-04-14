import { useState, useRef, useEffect } from 'react';

export default function ChatWindow({ messages, currentUser, recipientUser, onSendMessage, isRecipientOnline, isChatLoading = false, isSendingFiles = false, sendError: parentSendError = null }) {
  const [input, setInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [decryptingMessages, setDecryptingMessages] = useState({});
  const [localSendError, setLocalSendError] = useState(null);
  const messagesEndRef = useRef(null);
  const previousLengthRef = useRef(0);
  const decryptTimersRef = useRef(new Map());
  const fileInputRef = useRef(null);

  // Use parent error if provided, otherwise use local error
  const setSendError = (err) => setLocalSendError(err);
  const sendError = parentSendError || localSendError;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    previousLengthRef.current = 0;
    decryptTimersRef.current.forEach((timer) => clearTimeout(timer));
    decryptTimersRef.current.clear();
    setDecryptingMessages({});
  }, [recipientUser?._id]);

  useEffect(() => {
    if (!Array.isArray(messages) || isChatLoading) return;

    const isInitialLoad = previousLengthRef.current === 0;

    if (messages.length <= previousLengthRef.current) {
      previousLengthRef.current = messages.length;
      return;
    }

    let newMessages = messages.slice(previousLengthRef.current);
    
    // Performance guard: only animate the last 30 messages to avoid browser lockup on massive histories
    if (newMessages.length > 30) {
      newMessages = newMessages.slice(-30);
    }

    const startIndex = messages.length - newMessages.length;
    previousLengthRef.current = messages.length;

    const characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*';
    const toCipher = (content = '') => content
      .split('')
      .map((char) => {
        if (char === ' ') return ' ';
        return characters[Math.floor(Math.random() * characters.length)];
      })
      .join('');

    newMessages.forEach((msg, offset) => {
      const isSent = String(msg.sender_id) === String(currentUser?._id);
      if (isSent && !isInitialLoad) return;

      const originalIndex = startIndex + offset;
      const key = `msg_${originalIndex}`;

      setDecryptingMessages((prev) => ({
        ...prev,
        [key]: toCipher(String(msg.content || ''))
      }));

      const timer = setTimeout(() => {
        setDecryptingMessages((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        decryptTimersRef.current.delete(key);
      }, 1100);

      decryptTimersRef.current.set(key, timer);
    });
  }, [messages, currentUser?._id, isChatLoading]);

  useEffect(() => {
    return () => {
      decryptTimersRef.current.forEach((timer) => clearTimeout(timer));
      decryptTimersRef.current.clear();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() && selectedFiles.length === 0) return;
    onSendMessage({ content: input.trim(), files: selectedFiles });
    setInput('');
    setSelectedFiles([]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toISOString().replace('T', ' ').substring(0, 19) + 'Z';
  };

  const getRecipientTitle = () => {
    if (!recipientUser) return 'SIN_SELECCION';
    if (recipientUser.grado) {
      return `${recipientUser.grado} ${recipientUser.nombre}`;
    }
    return recipientUser.usuario || recipientUser.title || 'DESCONOCIDO';
  };

  const generateHash = (id) => {
    return Math.random().toString(16).substr(2, 8).toUpperCase();
  };

  if (!recipientUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-background border border-border relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20"></div>
        <div className="absolute inset-0 hazard-stripes opacity-[0.03] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-xl p-2xl border border-border-visible bg-surface/80 backdrop-blur-sm crosshairs">
          <span className="material-symbols-outlined text-[64px] text-text-disabled">enhanced_encryption</span>
          <div className="flex flex-col items-center gap-xs text-center">
            <span className="font-display text-heading text-text-primary tracking-widest">[ SELECCIONE_OBJETIVO ]</span>
            <span className="font-mono text-body-sm text-text-secondary mt-sm">CONECTANDO...</span>
            <div className="flex gap-2 mt-md">
              <span className="w-2 h-2 bg-text-disabled animate-pulse"></span>
              <span className="w-2 h-2 bg-text-disabled animate-pulse" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-text-disabled animate-pulse" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background relative z-10 border border-border">
      {/* Matrix Upload Overlay (shown during file transmission) */}
      {isSendingFiles && (
        <div className="matrix-upload-overlay">
          <div className="matrix-upload-grid"></div>
          <div className="matrix-upload-scanline"></div>
          
          <div className="matrix-upload-text">
            <div className="matrix-upload-status">
              TRANSMITIENDO_CARGA...
            </div>
            <div className="matrix-upload-progress">
              <div className="matrix-upload-progress-bar">
                <div className="matrix-upload-progress-fill"></div>
              </div>
              <div className="matrix-upload-label">
                ENVIANDO_ARCHIVOS_A_MINIO
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {sendError && (
        <div className="bg-danger/20 border-b border-danger px-md py-sm font-mono text-xs text-danger flex justify-between items-center">
          <span>[ERROR] {sendError}</span>
          <button
            onClick={() => setSendError(null)}
            className="cursor-pointer hover:text-danger-bright"
          >
            ✕
          </button>
        </div>
      )}
      {/* Banner superior / Clasificacion */}
      <div className="w-full bg-surface-raised flex justify-between items-center py-2xs px-sm border-b border-border shrink-0">
        <span className="font-mono text-[9px] text-text-disabled tracking-[0.2em]">
          CIFRADO_E2E: AES-256-GCM
        </span>
        <span className="font-mono text-[9px] text-text-disabled tracking-[0.2em] animate-pulse-slow text-accent">
          NO_TRANSMITIR_MATERIAL_CLASIFICADO_FUERA_DE_SCIF
        </span>
      </div>

      {/* Header */}
      <div className="bg-surface px-md py-md border-b border-border flex justify-between items-center shrink-0">
        <div className="flex items-center gap-md">
          <div className="flex flex-col items-center justify-center w-12 h-12 bg-surface-raised border border-border-visible crosshairs">
            <span className="material-symbols-outlined text-text-secondary">radar</span>
          </div>
          <div className="flex flex-col gap-2xs">
            <h2 className="font-display text-heading text-text-primary tracking-widest uppercase">
              {getRecipientTitle()}
            </h2>
            <span className="font-mono text-[10px] text-text-secondary flex items-center gap-xs">
              <span className="material-symbols-outlined text-[12px]">fingerprint</span>
              ID: {recipientUser._id} // NODE: {generateHash(recipientUser._id)}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2xs border-l border-border pl-md">
          <span className={`font-mono text-[10px] flex items-center gap-xs ${isRecipientOnline ? 'text-success' : 'text-text-disabled'}`}>
            {isRecipientOnline && <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse-slow"></span>}
             {isRecipientOnline ? 'ENLACE_SEGURO_ESTABLECIDO' : 'ENLACE_CORTADO'}
          </span>
          <span className="font-mono text-[10px] text-text-secondary">
            ZULU {new Date().toISOString().substring(11, 19)}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-xl overflow-y-auto custom-scrollbar flex flex-col gap-xl bg-background relative">
        {/* Background watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none z-0">
          <span className="font-display text-[200px] tracking-tighter rotate-[-15deg]">STRATCOM</span>
        </div>

        {isChatLoading ? (
          <div className="chat-loading-state flex-1 z-10 border border-border-visible bg-surface/70 backdrop-blur-sm p-md md:p-lg relative overflow-hidden">
            <div className="chat-loading-grid"></div>
            <div className="chat-loading-scanline"></div>
            <div className="chat-loading-glow"></div>

            <div className="relative z-10 h-full flex flex-col gap-md">
              <div className="flex items-center justify-between">
                 <span className="font-mono text-[10px] tracking-[0.16em] text-text-secondary">SINCRONIZANDO_CANAL_SEGURO</span>
                 <span className="font-mono text-[10px] tracking-[0.14em] text-success animate-pulse">EN_PROGRESO</span>
              </div>

              <div className="chat-loading-terminal border border-border bg-background/70 p-sm font-mono text-[10px] text-text-secondary leading-relaxed overflow-hidden">
                 <div>[NODO] par de claves efimero negociado...</div>
                 <div>[TLS ] validando huella de ruta...</div>
                 <div>[E2EE] reconstruyendo flujo de mensajes...</div>
                 <div className="text-success">[OK  ] canal de carga autenticado</div>
              </div>

              <div className="flex-1 flex flex-col gap-sm justify-end">
                {[0, 1, 2, 3].map((bar) => (
                  <div key={bar} className="chat-loading-row">
                    <div className="chat-loading-label"></div>
                    <div className="chat-loading-bar-wrap">
                      <div className="chat-loading-bar"></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chat-loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        ) : !Array.isArray(messages) || messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-md z-10">
            <span className="material-symbols-outlined text-[32px] text-text-disabled">lock_clock</span>
            <div className="flex flex-col items-center gap-xs text-center border border-border-visible p-md bg-surface">
               <span className="label-text text-text-primary">SIN_INTERCEPCIONES_PREVIAS</span>
               <span className="font-mono text-[9px] text-text-secondary">ESPERANDO_CARGA...</span>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isSent = String(msg.sender_id) === String(currentUser?._id);
            const showHeader = idx === 0 || (messages[idx - 1]?.sender_id !== msg.sender_id);
            const msgHash = msg._id?.startsWith('temp_') ? 'CALCULATING...' : `0x${generateHash(msg._id)}`;
            const msgKey = `msg_${idx}`;
            const decryptOverlay = decryptingMessages[msgKey];

            return (
              <div key={msg._id || idx} className={`flex flex-col max-w-[85%] relative z-10 ${isSent ? 'self-end items-end' : 'self-start items-start'}`}>
                {/* Message Header Block */}
                {showHeader && (
                  <div className={`flex items-end gap-sm mb-xs ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="font-mono text-[10px] font-bold text-text-primary bg-surface-raised px-xs py-2xs border border-border">
                       {msg.sender_name || 'ORIGEN_DESCONOCIDO'}
                    </span>
                    <span className="font-mono text-[9px] text-text-disabled pb-[2px]">
                       // ENRUTAMIENTO: {isSent ? 'SALIENTE' : 'ENTRANTE'}
                    </span>
                  </div>
                )}
                
                {/* Message Packet */}
                <div className={`relative flex flex-col w-full border ${
                  isSent 
                    ? 'bg-surface border-border border-r-2 border-r-text-primary' 
                    : 'bg-background border-border-visible border-l-2 border-l-success'
                }`}>
                  {/* Packet Meta Bar */}
                  <div className="w-full bg-surface-raised border-b border-border px-xs py-[2px] flex justify-between items-center">
                    <span className="font-mono text-[8px] text-text-secondary">SEQ: {String(idx).padStart(4, '0')}</span>
                    <span className="font-mono text-[8px] text-text-disabled">{msgHash}</span>
                  </div>
                  
                   {/* Packet Content */}
                   <div className="p-sm relative overflow-hidden">
                     {decryptOverlay && (
                       <p className="matrix-decrypt-overlay">
                         {decryptOverlay}
                       </p>
                     )}
                     <p className={`text-body-sm font-mono text-text-primary whitespace-pre-wrap break-words leading-relaxed transition-opacity duration-300 ${decryptOverlay ? 'opacity-0' : 'opacity-100'}`}>
                       {msg.content}
                     </p>
                     
                     {/* Attachments */}
                     {msg.attachments && msg.attachments.length > 0 && (
                       <div className="mt-sm pt-sm border-t border-border-visible flex flex-wrap gap-xs">
                         {msg.attachments.map((attachment, idx) => (
                           <a
                             key={idx}
                             href={attachment.file_url}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="attachment-link"
                             title={attachment.original_name || 'Download file'}
                           >
                             <span className="material-symbols-outlined text-xs">attach_file</span>
                             <span>{attachment.original_name || 'File'}</span>
                           </a>
                         ))}
                       </div>
                     )}
                   </div>
                </div>

                {/* Message Footer */}
                <div className={`flex items-center gap-xs mt-xs font-mono text-[8px] uppercase tracking-widest ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-text-secondary">
                    {formatTime(msg.timestamp || msg.created_at)}
                  </span>
                  {isSent && (
                    <>
                      <span className="text-text-disabled border-l border-border px-xs h-2"></span>
                      <span className={`${msg.status === 'SENT' ? 'text-text-disabled' : 'text-success'}`}>
                        [{msg.status || 'TRANSMITTED'}]
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} className="h-px w-full shrink-0" />
      </div>

       {/* Input Area (Command Prompt Style) */}
       <div className="p-md bg-surface border-t border-border shrink-0 flex flex-col gap-xs">
         <span className="font-mono text-[9px] text-text-secondary flex items-center gap-xs">
           <span className="material-symbols-outlined text-[12px] animate-pulse">keyboard_double_arrow_right</span>
            ESPERANDO_ENTRADA_DEL_OPERADOR
         </span>

         {/* Selected Files Chips */}
         {selectedFiles.length > 0 && (
           <div className="flex flex-wrap gap-xs p-xs bg-surface-raised border border-border-visible rounded">
             {selectedFiles.map((file, idx) => (
               <div key={idx} className="file-chip">
                 <span className="material-symbols-outlined text-[12px]">attachment</span>
                 <span title={file.name}>{file.name.substring(0, 20)}{file.name.length > 20 ? '...' : ''}</span>
                 <span className="text-text-disabled text-[8px]">{formatFileSize(file.size)}</span>
                 <button
                   onClick={() => removeFile(idx)}
                   className="file-chip-remove"
                   type="button"
                   title="Remove file"
                 >
                   ✕
                 </button>
               </div>
             ))}
           </div>
         )}
         
         <form onSubmit={handleSubmit} className="flex gap-md items-end">
           <div className="flex-1 relative flex flex-col border border-border focus-within:border-text-primary transition-colors bg-background p-xs">
             <div className="flex items-start">
               <span className="font-mono text-body-sm text-text-disabled mt-[6px] mr-xs select-none">root@TX&gt;</span>
               <textarea
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSubmit(e);
                   }
                 }}
                 className="w-full bg-transparent border-none focus:outline-none text-body-sm font-mono text-text-primary placeholder:text-text-disabled py-xs resize-none min-h-[44px] max-h-[120px] custom-scrollbar"
                placeholder="ESCRIBA_CARGA..."
                 rows={1}
               />
             </div>
             {/* Terminal blinking cursor effect if empty */}
             {input.length === 0 && (
               <div className="absolute top-[10px] left-[78px] pointer-events-none">
                 <span className="terminal-cursor"></span>
               </div>
             )}
           </div>

           {/* File Picker Button */}
           <input
             ref={fileInputRef}
             type="file"
             multiple
             onChange={handleFileSelect}
             className="hidden"
             id="file-input"
             disabled={isSendingFiles}
           />
           <button
             type="button"
             onClick={() => fileInputRef.current?.click()}
             disabled={isSendingFiles}
             className="border border-text-secondary bg-transparent text-text-secondary hover:bg-text-secondary/10 px-md py-sm font-mono text-xs font-bold transition-colors flex items-center gap-xs h-[44px] shrink-0 crosshairs disabled:opacity-50 disabled:cursor-not-allowed"
             title="Attach files"
           >
             <span className="material-symbols-outlined text-sm">attach_file</span>
             <span className="hidden sm:inline">[ ADJUNTAR ]</span>
           </button>

           <button 
             type="submit"
             disabled={(!input.trim() && selectedFiles.length === 0) || isSendingFiles}
             className="border border-text-primary bg-text-primary text-background hover:bg-text-display px-md py-sm font-mono text-xs font-bold transition-colors disabled:opacity-50 disabled:hover:bg-text-primary disabled:cursor-not-allowed flex items-center gap-xs h-[44px] shrink-0 crosshairs"
           >
              <span>[ ENVIAR_TX ]</span>
           </button>
         </form>
       </div>
    </div>
  );
}
