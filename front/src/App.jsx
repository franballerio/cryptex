import { useState, createContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Chat from './pages/Chat'
import Vault from './pages/Vault'
import NetworkScanner from './pages/NetworkScanner'
import ProtectedRoute from './components/ProtectedRoute'

export const LayoutContext = createContext({ showFullLayout: false })

function App() {
  const [showFullLayout, setShowFullLayout] = useState(false)

  return (
    <LayoutContext.Provider value={{ showFullLayout }}>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {showFullLayout ? (
          <Route 
            path="/app"
            element={
              // <ProtectedRoute>
                <Layout />
              // </ProtectedRoute>
            }
          >
            <Route path="chat" element={<Chat />} />
            <Route path="vault" element={<Vault />} />
            <Route path="network" element={<NetworkScanner />} />
          </Route>
        ) : (
          <Route 
            path="/app/*"
            element={
              <div className="flex h-screen w-full bg-[#0d1117] overflow-hidden flex-col">
                <Chat />
              </div>
            }
          />
        )}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </LayoutContext.Provider>
  )
}

export default App