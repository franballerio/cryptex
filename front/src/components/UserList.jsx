import { useNavigate } from 'react-router-dom';

export default function UserList({ users, onlineUsers, selectedUser, onSelect, currentUserId }) {
  const navigate = useNavigate();
  
  const getUserTitle = (user) => {
    if (user.grado) {
      return `${user.grado} ${user.nombre}`;
    }
    return user.usuario || user.title || 'DESCONOCIDO';
  };

  const filteredUsers = users.filter(u => u._id !== currentUserId);

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aOnline = onlineUsers.includes(String(a._id));
    const bOnline = onlineUsers.includes(String(b._id));
    if (aOnline === bOnline) {
      return getUserTitle(a).localeCompare(getUserTitle(b));
    }
    return aOnline ? -1 : 1;
  });

  const handleLogout = () => {
    document.cookie = 'access_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/');
  };

  // Genera coordenadas militares de muestra basadas en ID para estetica
  const generateCoords = (id) => {
    if (!id) return "00°00'00\"N 00°00'00\"E";
    const num = parseInt(id.substring(0, 8), 16) || 12345;
    const lat = ((num % 180) - 90).toFixed(4);
    const lon = (((num * 3) % 360) - 180).toFixed(4);
    return `${lat}° ${lon}°`;
  };

  return (
    <div className="flex flex-col h-full bg-background border-none relative overflow-hidden">
      
      {/* Encabezado del panel */}
      <div className="p-sm border-b border-border flex justify-between items-center bg-surface relative z-10 shrink-0">
        <div className="flex flex-col gap-[2px]">
          <span className="label-text text-text-primary tracking-[0.3em]">
            SEGUIMIENTO_ACTIVOS
          </span>
          <span className="font-mono text-[8px] text-text-secondary">TACTICO // MODULO_A</span>
        </div>
        <button 
          onClick={handleLogout}
          className="label-text text-accent hover:bg-accent-subtle transition-colors border border-transparent hover:border-accent px-xs py-2xs flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-[14px]">logout</span>
          CERRAR_SESION
        </button>
      </div>
      
      {/* Barra de busqueda/filtro (visual) */}
      <div className="bg-surface-raised border-b border-border px-sm py-xs flex items-center justify-between shrink-0">
        <span className="font-mono text-[9px] text-text-disabled">FILTRO: TODOS_LOS_ACTIVOS</span>
        <span className="material-symbols-outlined text-[14px] text-text-disabled">tune</span>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative z-10 p-xs gap-xs">
        {sortedUsers.length === 0 ? (
          <div className="p-xl flex justify-center items-center h-full">
            <span className="label-text text-text-disabled animate-pulse-slow">[SIN_ACTIVOS_DETECTADOS]</span>
          </div>
        ) : (
          sortedUsers.map((user) => {
            const isOnline = onlineUsers.includes(String(user._id));
            const isSelected = selectedUser?._id === user._id;
            const coords = generateCoords(user._id);
            
            return (
              <button
                key={user._id}
                onClick={() => {
                  if (!isSelected) {
                    onSelect(user);
                  }
                }}
                className={`relative flex flex-col p-sm border transition-all text-left w-full group ${
                  isSelected 
                    ? 'bg-surface-raised border-text-primary crosshairs' 
                    : 'bg-background hover:bg-surface border-border hover:border-border-visible'
                }`}
              >
                {/* Status Indicator Bar */}
                <div className={`absolute top-0 bottom-0 left-0 w-1 ${isOnline ? 'bg-success' : 'bg-border-visible'}`}></div>
                
                <div className="flex justify-between items-start w-full pl-sm">
                  <div className="flex flex-col gap-[2px]">
                    <span className={`font-mono text-body-sm font-bold uppercase truncate tracking-tight ${isSelected ? 'text-text-display' : 'text-text-primary'}`}>
                      {isSelected && <span className="mr-xs text-text-disabled">&gt;</span>}
                      {getUserTitle(user)}
                    </span>
                    <span className="label-text text-text-secondary">
                      ID_OP: {user.usuario}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-end gap-[2px]">
                    <span className={`label-text flex items-center gap-xs ${isOnline ? 'text-success' : 'text-text-disabled'}`}>
                      {isOnline ? '[ ENLACE_ACTIVO ]' : '[ DESCONECTADO ]'}
                    </span>
                    <span className="font-mono text-[8px] text-text-disabled tracking-widest mt-xs">
                      {isOnline ? 'PING: 12ms' : 'SIN_SENAL'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center w-full mt-sm pl-sm pt-xs border-t border-border-visible border-dashed">
                  <div className="flex gap-xs items-center">
                    <span className="material-symbols-outlined text-[10px] text-text-secondary">my_location</span>
                    <span className="font-mono text-[9px] text-text-secondary">UBIC: {coords}</span>
                  </div>
                  <span className="font-mono text-[9px] text-text-disabled">
                     SENAL: {isOnline ? '89%' : '0%'}
                  </span>
                </div>
                
                 {/* Scanline de superposicion en hover */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-text-primary to-transparent opacity-0 group-hover:opacity-[0.03] translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-700"></div>
              </button>
            );
          })
        )}
      </div>

      <div className="p-sm border-t border-border bg-surface flex justify-between items-center shrink-0 z-10">
        <span className="font-mono text-[10px] text-text-secondary flex items-center gap-xs">
          <span className="material-symbols-outlined text-[14px]">cell_tower</span>
           ESTADO_RED
        </span>
        <div className="flex gap-xs">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-1 h-3 ${i < 4 ? 'bg-success' : 'bg-border-visible'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
