import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const navigate = useNavigate()
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate('/', { replace: true })
    }
  }, [currentUser, navigate])

  return (
    <div className="flex h-screen bg-background text-text-primary overflow-hidden font-body selection:bg-border selection:text-text-display">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border-visible bg-background flex flex-col z-40 relative">
        
        {/* User Identity / Primary Layer */}
        <div className="px-lg py-xl flex flex-col gap-sm border-b border-border">
          <div className="flex items-center gap-md">
            {/* Minimal Avatar */}
            <div className="w-12 h-12 bg-surface flex items-center justify-center border border-border">
              <span className="font-display text-text-secondary text-subheading">A1</span>
            </div>
            
            <div>
              <h2 className="font-body text-heading font-bold tracking-tight text-text-display uppercase leading-tight">
                ALPHA
              </h2>
              <p className="label-text mt-xs flex items-center gap-xs">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                CONECTADO
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-md overflow-y-auto custom-scrollbar flex flex-col gap-xs px-md">
          <p className="label-text mb-md px-sm">MODULOS</p>
          
          <NavLink 
            to="/app/chat"
            className={({ isActive }) => 
              `flex items-center gap-md px-md py-sm transition-colors duration-fast ${
                isActive 
                  ? 'bg-surface text-text-display border border-border-visible' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface border border-transparent'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px] opacity-80">group</span>
            <span className="label-text text-inherit">OPERADORES</span>
          </NavLink>
          
          <NavLink 
            to="/app/vault"
            className={({ isActive }) => 
              `flex items-center gap-md px-md py-sm transition-colors duration-fast ${
                isActive 
                  ? 'bg-surface text-text-display border border-border-visible' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface border border-transparent'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px] opacity-80">terminal</span>
            <span className="label-text text-inherit">SISTEMA</span>
          </NavLink>
          
          <NavLink 
            to="/app/network"
            className={({ isActive }) => 
              `flex items-center gap-md px-md py-sm transition-colors duration-fast ${
                isActive 
                  ? 'bg-surface text-text-display border border-border-visible' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface border border-transparent'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px] opacity-80">biotech</span>
            <span className="label-text text-inherit">TELEMETRIA</span>
          </NavLink>
        </nav>

        {/* Footer / Meta */}
        <div className="p-lg border-t border-border mt-auto">
          <div className="flex items-center justify-between mb-lg">
            <span className="label-text text-text-disabled">SYS.VER</span>
            <span className="label-text">v2.0.4</span>
          </div>
          
          <button className="w-full flex items-center justify-center gap-sm px-md py-sm border border-border hover:border-accent text-accent transition-colors duration-fast group">
            <span className="material-symbols-outlined text-[16px]">power_settings_new</span>
            <span className="label-text text-accent group-hover:text-accent">DESCONECTAR</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background relative z-0">
        <div className="absolute inset-0 pointer-events-none dot-grid-subtle opacity-30 z-[-1]"></div>
        <Outlet context={{ showFullLayout: true }} />
      </main>
    </div>
  )
}
