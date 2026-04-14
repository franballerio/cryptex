import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Meta en tiempo real
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    if (currentUser) {
      navigate('/app/chat', { replace: true })
    }
  }, [currentUser, navigate])

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!username || !password) {
      setError('[ERR: MISSING CREDENTIALS]')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user: username, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.Error || 'Autenticacion fallida')
      }
      
      setCurrentUser(data)
      navigate('/app/chat', { replace: true })
    } catch (err) {
      setError(`[ERR: ${err.message.toUpperCase()}]`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary selection:bg-border selection:text-text-display relative overflow-hidden">
      
      {/* Patron de fondo */}
      <div className="absolute inset-0 pointer-events-none dot-grid opacity-20 z-0"></div>

      {/* Barra superior: capa terciaria */}
      <header className="w-full flex items-center justify-between px-xl py-lg border-b border-border z-10 relative bg-background">
        <div className="flex gap-xl items-center">
          <span className="label-text">SYS.AUTH.V4</span>
          <span className="label-text text-text-disabled hidden md:inline-block">ACCESO_RESTRINGIDO</span>
        </div>
        <div className="flex gap-xl items-center text-right">
          <div className="flex flex-col items-end">
            <span className="label-text text-text-disabled">SYS_TIME</span>
            <span className="font-mono text-body-sm tracking-tight">{time.toLocaleTimeString('en-US', { hour12: false })}</span>
          </div>
          <div className="flex flex-col items-end">
              <span className="label-text text-text-disabled">ESTADO</span>
            <span className="font-mono text-body-sm text-success tracking-tight flex items-center gap-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span> EN_LINEA
            </span>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col justify-center items-center p-xl z-10 relative">
        
        <div className="w-full max-w-[480px] flex flex-col gap-2xl">
          
          {/* Hero principal */}
          <div className="flex flex-col gap-sm">
              <h1 className="hero-number">ACCESO</h1>
              <p className="font-body text-heading text-text-secondary tracking-tight">
                Ingrese credenciales para acceder al sistema.
              </p>
          </div>

          {/* Contenedor de formulario */}
          <form onSubmit={handleLogin} className="flex flex-col gap-xl">
            
            <div className="flex flex-col gap-md">
              <div className="flex flex-col gap-xs">
                <label className="label-text text-text-secondary flex justify-between">
                  <span>ID_OPERADOR</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-surface border border-border-visible text-body font-mono px-md py-sm focus:outline-none focus:border-text-primary transition-colors disabled:opacity-50"
                  placeholder="..."
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="label-text text-text-secondary flex justify-between">
                  <span>CODIGO_ACCESO</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface border border-border-visible text-body font-mono px-md py-sm focus:outline-none focus:border-text-primary transition-colors disabled:opacity-50"
                  placeholder="..."
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="border border-accent/30 bg-accent-subtle p-sm flex items-start gap-sm">
                <span className="material-symbols-outlined text-accent text-[16px] mt-[2px]">warning</span>
                <span className="label-text text-accent">{error}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-text-primary text-background font-body text-body font-medium px-lg py-md hover:bg-text-display active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-sm"
            >
              {loading ? (
                <span className="label-text text-background">[VERIFICANDO...]</span>
              ) : (
                <>
                  <span>Autenticar</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Advertencia / Meta */}
          <div className="pt-xl border-t border-border flex flex-col gap-sm">
            <p className="label-text text-text-disabled">
              ADVERTENCIA: El acceso no autorizado a sistemas STRATCOM activara bloqueo inmediato de terminal y rastreo de ubicacion.
            </p>
            <p className="label-text text-text-disabled">
              CIFRADO: AES-256 (RESISTENTE_CUANTICO)
            </p>
          </div>
          
        </div>
      </main>

    </div>
  )
}
