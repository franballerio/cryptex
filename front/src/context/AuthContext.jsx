import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { socketService } from '../services/socket';
import { getToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketInitializedRef = useRef(false);

  // Verifica autenticacion al montar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      } catch (e) {
        console.error('[AUTH] Fallo al verificar autenticacion:', e);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Inicializa socket una vez autenticado
  useEffect(() => {
    if (!currentUser || socketInitializedRef.current) return;

    const initializeSocket = async () => {
      try {
        const tokenData = await getToken();
        const token = tokenData.token || tokenData;
        console.log('[AUTH] Inicializando socket con token');
        
        if (token) {
          socketService.connect(token);
          socketInitializedRef.current = true;
        }
      } catch (err) {
        console.error('[AUTH] Error al inicializar socket:', err);
      }
    };

    initializeSocket();

    // Limpieza de socket al cerrar sesion
    return () => {
      if (socketInitializedRef.current) {
        console.log('[AUTH] Desconectando socket al cerrar sesion');
        socketService.disconnect();
        socketInitializedRef.current = false;
      }
    };
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, loading, setCurrentUser, socketService }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
