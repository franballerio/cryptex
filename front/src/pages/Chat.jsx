import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import TopBar from '../components/TopBar';
import UserList from '../components/UserList';
import ChatWindow from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext';
import { getUsers, getChatHistory, getOnlineUsers, uploadChatFiles } from '../services/api';

export default function Chat() {
  const navigate = useNavigate();
  const { currentUser, socketService } = useAuth();
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sysLogs, setSysLogs] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSendingFiles, setIsSendingFiles] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messageHandlerRef = useRef(null);
  const onlineHandlerRef = useRef(null);
  const offlineHandlerRef = useRef(null);
  const socketEventHandlerRef = useRef(null);
  const sysLogContainerRef = useRef(null);
  const loadingDelayTimeoutRef = useRef(null);

  const addLog = useCallback((type, message, level = 'normal', ts) => {
    const stamp = ts || new Date().toISOString();
    setSysLogs((prev) => {
      const next = [
        ...prev,
        {
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          ts: stamp,
          type,
          message,
          level
        }
      ];
      return next.slice(-20);
    });
  }, []);

  const formatLogTime = useCallback((timestamp) => {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return '00:00:00';
    return date.toTimeString().slice(0, 8);
  }, []);

  const mapSocketEventToLog = useCallback((eventData) => {
    const { direction, event, payload, timestamp } = eventData || {};

    if (event === 'chat_message') {
      if (direction === 'out') {
        return { type: 'SENT', message: 'Paquete enviado', level: 'success', timestamp };
      }
      return { type: 'RECEIVED', message: 'Paquete recibido', level: 'accent', timestamp };
    }

    if (event === 'join_room' && direction === 'out') {
      return { type: 'ENCRYPT', message: 'Encriptando informacion', level: 'warning', timestamp };
    }

    if (event === 'user_online') {
      return { type: 'ONLINE', message: 'Objetivo encontrado', level: 'success', timestamp };
    }

    if (event === 'user_offline') {
      return { type: 'OFFLINE', message: 'Objetivo perdido de vista', level: 'muted', timestamp };
    }

    if (event === 'socket_connected') {
      return { type: 'CONNECT', message: 'Enlace seguro establecido', level: 'success', timestamp };
    }

    if (event === 'socket_disconnected') {
      return { type: 'DISCONNECT', message: 'Enlace interrumpido', level: 'warning', timestamp };
    }

    if (event === 'socket_error') {
      return {
        type: 'ERROR',
        message: payload?.message ? `Fallo de enlace: ${payload.message}` : 'Fallo de enlace',
        level: 'danger',
        timestamp
      };
    }

    const fallbackType = String(event || 'EVENT').toUpperCase();
    const fallbackDirection = direction === 'out' ? 'ENVIO' : 'RECEPCION';
    return {
      type: fallbackType,
      message: `Evento de socket (${fallbackDirection})`,
      level: 'normal',
      timestamp
    };
  }, []);

  useEffect(() => {
    return () => {
      if (loadingDelayTimeoutRef.current) {
        clearTimeout(loadingDelayTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!sysLogContainerRef.current) return;
    sysLogContainerRef.current.scrollTop = sysLogContainerRef.current.scrollHeight;
  }, [sysLogs]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const getChatId = useCallback((userId1, userId2) => {
    return [String(userId1), String(userId2)].sort().join('');
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await getUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error('[CHAT] Error fetching users:', err);
      setError('Error al obtener operadores');
    }
  }, []);

  const fetchOnlineUsers = useCallback(async () => {
    try {
      setOnlineUsers([]);
    } catch (err) {
      console.error('[CHAT] Error al obtener usuarios en linea:', err);
    }
  }, []);

  const fetchChatHistory = useCallback(async (user) => {
    if (!currentUser || !user) return;

    const chatId = getChatId(currentUser._id, user._id);
    setIsChatLoading(true);
    setMessages([]);
    try {
      const response = await getChatHistory(chatId, currentUser._id, user._id);

      if (response && Array.isArray(response.data)) {
        setMessages(response.data);
      } else if (Array.isArray(response)) {
        setMessages(response);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('[CHAT] Error al obtener historial del chat:', err);
      setMessages([]);
    } finally {
      if (loadingDelayTimeoutRef.current) {
        clearTimeout(loadingDelayTimeoutRef.current);
      }
      loadingDelayTimeoutRef.current = setTimeout(() => {
        setIsChatLoading(false);
        loadingDelayTimeoutRef.current = null;
      }, 2000);
    }
  }, [currentUser, getChatId]);

  const handleSelectUser = useCallback(async (user) => {
    if (!currentUser || !socketService) return;
    
    setSelectedUser(user);
    socketService.joinRoom(currentUser._id, user._id);

    await fetchChatHistory(user);
  }, [currentUser, socketService, fetchChatHistory]);

  const handleSendMessage = useCallback(async ({ content, files = [] }) => {
    if (!currentUser || !selectedUser || !socketService) return;

    setSendError(null);

    const chatId = getChatId(currentUser._id, selectedUser._id);
    const senderName = currentUser.grado 
      ? `${currentUser.grado} ${currentUser.nombre} ${currentUser.apellido}`
      : currentUser.usuario;

    let attachments = [];

    // If files exist, upload them first
    if (files && files.length > 0) {
      setIsSendingFiles(true);
      try {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files', file);
        });
        formData.append('chat_id', chatId);
        formData.append('receiver_id', selectedUser._id);

        addLog('UPLOAD', 'Transmitiendo archivos...', 'warning');
        
        const uploadResponse = await uploadChatFiles(formData);

        if (uploadResponse.success && uploadResponse.data?.files) {
          attachments = uploadResponse.data.files;
          addLog('UPLOAD', `${attachments.length} archivo(s) transmitido(s)`, 'success');
        }
      } catch (err) {
        console.error('[CHAT] File upload error:', err);
        setSendError(`Error al enviar archivos: ${err.message}`);
        addLog('UPLOAD', `Error: ${err.message}`, 'danger');
        setIsSendingFiles(false);
        return;
      }
    }

    // Use sentinel text if content is empty but files exist
    const messageContent = content.trim() || (attachments.length > 0 ? '[ARCHIVOS]' : '');
    
    if (!messageContent && attachments.length === 0) {
      setSendError('Escriba un mensaje o seleccione archivos');
      setIsSendingFiles(false);
      return;
    }

    const tempMessage = {
      _id: `temp_${Date.now()}`,
      content: messageContent,
      sender_id: currentUser._id,
      sender_name: senderName,
      receiver_id: selectedUser._id,
      timestamp: new Date().toISOString(),
      status: 'SENT',
      attachments: attachments.length > 0 ? attachments : undefined
    };

    setMessages(prev => [...prev, tempMessage]);
    socketService.sendMessage(messageContent, chatId, currentUser._id, senderName, selectedUser._id, attachments);
    
    setIsSendingFiles(false);
  }, [currentUser, selectedUser, getChatId, socketService, addLog]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchOnlineUsers()]);
      setLoading(false);
    };
    init();
  }, [fetchUsers, fetchOnlineUsers]);

   useEffect(() => {
     if (!socketService) return;

     messageHandlerRef.current = (payload) => {
       if (!currentUser || !selectedUser) return;
       const chatId = getChatId(currentUser._id, selectedUser._id);
       if (payload.chat_id === chatId) {
         setMessages(prev => [...prev, payload]);
       }
     };

     onlineHandlerRef.current = (payload) => {
       setOnlineUsers(prev => [...prev, String(payload.user_id)]);
     };

     offlineHandlerRef.current = (payload) => {
       setOnlineUsers(prev => prev.filter(id => id !== String(payload.user_id)));
     };

     socketEventHandlerRef.current = (eventData) => {
       const log = mapSocketEventToLog(eventData);
       addLog(log.type, log.message, log.level, log.timestamp);
     };

     socketService.on('chat_message', messageHandlerRef.current);
     socketService.on('user_online', onlineHandlerRef.current);
     socketService.on('user_offline', offlineHandlerRef.current);
     socketService.on('socket_event', socketEventHandlerRef.current);

     return () => {
       socketService.off('chat_message', messageHandlerRef.current);
       socketService.off('user_online', onlineHandlerRef.current);
       socketService.off('user_offline', offlineHandlerRef.current);
       socketService.off('socket_event', socketEventHandlerRef.current);
      };
   }, [socketService, currentUser, selectedUser, getChatId, addLog, mapSocketEventToLog]);

  const isRecipientOnline = selectedUser 
    ? onlineUsers.includes(String(selectedUser._id))
    : false;

  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <p className="label-text">[CARGANDO...]</p>
      </div>
    );
  }

  return (
    <>
      <main className="flex-1 p-xl bg-background flex gap-xl overflow-hidden relative z-10">
        
        {/* Left Column: User List */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-sm">
          <h2 className="label-text text-text-secondary px-sm">DIRECTORIO</h2>
          <div className="flex-1 border border-border-visible bg-surface overflow-hidden">
            <UserList 
              users={users}
              onlineUsers={onlineUsers}
              selectedUser={selectedUser}
              onSelect={handleSelectUser}
              currentUserId={currentUser._id}
            />
          </div>
        </div>

        {/* Center Column: Chat Window */}
        <div className="flex-1 flex flex-col gap-sm min-w-0">
          <h2 className="label-text text-text-secondary px-sm">
             {selectedUser ? `ENLACE_COMMS: ${selectedUser.usuario}` : 'ESPERANDO_SELECCION'}
          </h2>
           <div className="flex-1 border border-border-visible bg-surface overflow-hidden flex flex-col relative">
             <ChatWindow 
               messages={messages}
               currentUser={currentUser}
               recipientUser={selectedUser}
               onSendMessage={handleSendMessage}
               isRecipientOnline={isRecipientOnline}
               isChatLoading={isChatLoading}
               isSendingFiles={isSendingFiles}
               sendError={sendError}
             />
           </div>
        </div>

        {/* Right Column: Telemetry (Tertiary Information) */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-xl h-full">
          
          {/* Status Block */}
          <div className="flex flex-col gap-md">
            <div className="flex items-center justify-between px-sm">
               <h2 className="label-text text-text-secondary">TELEMETRIA</h2>
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            </div>
            
            <div className="border border-border-visible p-md flex flex-col gap-md bg-surface crosshairs">
              <div className="flex justify-between items-center">
                <span className="label-text text-text-secondary">CPU</span>
                <span className="font-mono text-body text-text-primary">24.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="label-text text-text-secondary">MEM</span>
                <span className="font-mono text-body text-text-primary">2.1GB</span>
              </div>
              <div className="w-full h-[1px] bg-border-visible my-xs"></div>
              <div className="flex justify-between items-center">
                 <span className="label-text text-text-secondary">ENLACE</span>
                <span className="font-mono text-body text-success flex items-center gap-xs">
                   <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span> SEGURO
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="label-text text-text-secondary">ENC</span>
                <span className="font-mono text-body text-text-primary">AES-256</span>
              </div>
            </div>
          </div>

          {/* Radar Block */}
          <div className="flex flex-col gap-md">
            <h2 className="label-text text-text-secondary px-sm">SAT_RADAR</h2>
            <div className="border border-border-visible bg-surface aspect-square relative p-4 flex items-center justify-center overflow-hidden crosshairs">
              <div className="absolute inset-0 border-[0.5px] border-border-visible rounded-full m-4"></div>
              <div className="absolute inset-0 border-[0.5px] border-border-visible rounded-full m-12"></div>
              <div className="absolute inset-0 border-[0.5px] border-border-visible rounded-full m-20"></div>
              <div className="w-[1px] h-full bg-border-visible absolute top-0 left-1/2 -translate-x-1/2"></div>
              <div className="h-[1px] w-full bg-border-visible absolute top-1/2 left-0 -translate-y-1/2"></div>
              <div className="absolute inset-0 rounded-full overflow-hidden m-4">
                <div className="radar-sweep opacity-30"></div>
              </div>
              <span className="relative z-10 w-2 h-2 bg-text-primary rounded-full"></span>
              {/* Fake Targets */}
              <span className="absolute w-1 h-1 bg-accent rounded-full top-1/4 left-1/3 opacity-70 animate-pulse"></span>
              <span className="absolute w-1.5 h-1.5 bg-warning rounded-full bottom-1/3 right-1/4 opacity-90 animate-pulse"></span>
            </div>
          </div>

          {/* Activity Graph / Logs */}
          <div className="flex flex-col gap-md flex-1 overflow-hidden">
            <h2 className="label-text text-text-secondary px-sm">SYS_LOG</h2>
            <div ref={sysLogContainerRef} className="border border-border-visible bg-surface flex-1 relative p-sm flex flex-col justify-end font-mono text-[10px] leading-tight text-text-disabled overflow-y-auto overflow-x-hidden custom-scrollbar">
              <div className="flex flex-col gap-1 w-full justify-end min-h-full">
                {sysLogs.length === 0 ? (
                  <div className="opacity-60">[00:00:00] [BOOT] ESPERANDO EVENTOS...</div>
                ) : (
                  sysLogs.map((entry) => (
                    <div
                      key={entry.id}
                      className={
                        entry.level === 'success'
                          ? 'text-success'
                          : entry.level === 'accent'
                            ? 'text-text-secondary'
                            : entry.level === 'warning'
                              ? 'text-warning'
                              : entry.level === 'danger'
                                ? 'text-danger'
                                : entry.level === 'muted'
                                  ? 'opacity-80'
                                  : 'opacity-90'
                      }
                    >
                      [{formatLogTime(entry.ts)}] [{entry.type}] {entry.message}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="h-2 w-full hazard-stripes-dim opacity-50 mt-xs"></div>
          </div>
          
        </div>
      </main>
    </>
  );
}
