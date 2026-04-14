import { NavLink } from 'react-router-dom'
import { useContext } from 'react'
import { LayoutContext } from '../App'

export default function TopBar({ title = 'INTEL_TACTICO_V4' }) {
  const { showFullLayout } = useContext(LayoutContext)

  const navLinks = [
    { path: '/app/network', label: 'TELEMETRIA' },
    { path: '/app/chat', label: 'OPERADORES' },
    { path: '/app/vault', label: 'SISTEMA' },
  ]

  return (
    <div className="flex flex-col shrink-0 z-50 relative">
      {/* Top Secret Classification Banner */}
      <div className="w-full bg-accent flex justify-center items-center py-2xs relative overflow-hidden">
        <div className="absolute inset-0 hazard-stripes opacity-20 mix-blend-multiply pointer-events-none"></div>
        <span className="label-text text-background font-bold tracking-[0.2em] relative z-10 text-[10px]">
          [ ALTO_SECRETO // COMUNICACIONES_TACTICAS // NOFORN ]
        </span>
      </div>

      <header className="bg-background border-b border-border flex justify-between items-center px-xl py-sm relative">
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none"></div>

        <div className="flex items-center gap-xl relative z-10">
          <div className="flex flex-col gap-2xs">
            <span className="label-text text-text-primary flex items-center gap-xs">
              <span className="w-2 h-2 bg-text-primary"></span>
              SYS.{title.toUpperCase()}
            </span>
              <span className="font-mono text-[9px] text-text-secondary tracking-widest">NIVEL_ACCESO: 5</span>
          </div>
          
          {showFullLayout && (
            <nav className="hidden md:flex gap-lg border-l border-border pl-xl h-full items-center">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `label-text transition-colors flex items-center gap-xs ${
                      isActive
                        ? 'text-text-primary border-b border-text-primary pb-xs'
                        : 'text-text-secondary hover:text-text-primary pb-xs border-b border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="font-mono text-[8px] text-text-primary animate-pulse-slow">▶</span>}
                      {link.label}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-md relative z-10">
          <div className="bg-surface border border-border flex items-center px-sm py-xs focus-within:border-text-primary transition-colors">
            <span className="material-symbols-outlined text-[16px] text-text-disabled">radar</span>
            <input
              className="bg-transparent border-none focus:outline-none ml-xs text-body-sm font-mono text-text-primary placeholder:text-text-disabled w-32 md:w-64 uppercase"
               placeholder="INGRESE_HASH_DE_CONSULTA..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-xs border-l border-border pl-md">
            <div className="flex flex-col items-end mr-sm">
              <span className="font-mono text-[9px] text-text-secondary">ENLACE_SEGURO</span>
              <span className="font-mono text-[9px] text-text-disabled">AES-256-CTR</span>
            </div>
            <button className="p-xs bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-text-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">satellite_alt</span>
            </button>
            <button className="p-xs bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-text-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">terminal</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  )
}
