import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';

const accessLogs = [
  { time: '14:22:01', type: 'authorized', details: 'Solicitud autorizada desde #NODO_77', hash: '77a1...bf4e', status: 'EXITO' },
  { time: '13:58:44', type: 'success', details: 'Rotacion simetrica completada', hash: 'ESTADO', status: 'EXITO' },
  { time: '12:04:12', type: 'error', details: 'Firma no reconocida detectada', hash: 'PROXY_DESCONOCIDO', status: 'ADVERTENCIA' },
  { time: '11:30:00', type: 'success', details: 'Heartbeat automatico del sistema', hash: 'VERIFICADO', status: 'EXITO' },
];

const gridNodes = [
  { name: 'Nodo Grid 01', status: 'ACTIVO_CONECTADO', icon: 'hub' },
  { name: 'Nodo Grid 02', status: 'LATENTE', icon: 'hub', dim: true },
  { name: 'Nodo Grid 03', status: 'ACTIVO_ENRUTANDO', icon: 'hub' },
  { name: 'Puerto Bridge', status: 'CIFRADO_SSL_V3', icon: 'router' },
];

const overrides = [
  { name: 'Bypass_MFA', icon: 'security_update_warning', enabled: false },
  { name: 'Forzar_Offline', icon: 'cloud_off', enabled: false },
  { name: 'Desactivar_HoneyPots', icon: 'leak_remove', enabled: false },
  { name: 'Purgado_Emergencia', icon: 'dangerous', enabled: true, danger: true },
];

export default function Vault() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);
  
  return (
    <div className="flex flex-col h-screen bg-background text-text-primary overflow-hidden font-body">
      <TopBar title="BOVEDA_SEGURIDAD" />
      
      <div className="flex-1 p-xl overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto flex flex-col gap-xl pb-xl">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-xl border-b border-border-visible pb-md">
            <div>
               <span className="label-text">MODULO_04 // NUCLEO_SEGURIDAD</span>
              <h1 className="font-display text-display-lg text-text-display mt-xs uppercase">
                 BOVEDA_DE_SEGURIDAD
              </h1>
            </div>
            <div className="flex gap-md">
              <button className="border border-border-visible bg-surface hover:bg-surface-raised text-text-primary px-lg py-sm font-mono text-label uppercase tracking-widest transition-all">
                 FORZAR_SYNC
              </button>
              <button className="bg-text-primary text-background hover:bg-text-secondary px-lg py-sm font-mono text-label uppercase tracking-widest transition-all">
                 GENERAR_NUEVA_SEMILLA
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-md">
            
            {/* Primary Entropy Visualization */}
            <div className="md:col-span-8 panel-border p-xl flex flex-col justify-between min-h-[400px] relative overflow-hidden crosshairs">
              <div className="absolute top-0 right-0 p-xl opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2xl">
                  <div>
                     <h3 className="label-text">METRICAS_ENTROPIA_BOVEDA</h3>
                     <p className="text-body-sm text-text-secondary mt-xs">Analisis de aleatoriedad criptografica en tiempo real</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="hero-number text-text-primary">99.98%</span>
                     <p className="label-text mt-xs text-text-secondary">CONFIANZA_DEL_SISTEMA</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-xl mt-xl">
                  <div className="flex flex-col gap-sm">
                    <div className="h-[2px] w-full bg-border-visible overflow-hidden">
                      <div className="h-full bg-text-primary w-[85%]"></div>
                    </div>
                    <span className="label-text">QUANTUM_HARVEST</span>
                    <p className="font-mono text-heading">1.2 TB/s</p>
                  </div>
                  <div className="flex flex-col gap-sm">
                    <div className="h-[2px] w-full bg-border-visible overflow-hidden">
                      <div className="h-full bg-text-primary w-[42%]"></div>
                    </div>
                    <span className="label-text">NOISE_JITTER</span>
                    <p className="font-mono text-heading">0.04 ms</p>
                  </div>
                  <div className="flex flex-col gap-sm">
                    <div className="h-[2px] w-full bg-border-visible overflow-hidden">
                      <div className="h-full bg-text-primary w-[98%]"></div>
                    </div>
                    <span className="label-text">POOL_SATURATION</span>
                    <p className="font-mono text-heading">98.1%</p>
                  </div>
                </div>
              </div>

              <div className="mt-xl h-32 w-full bg-surface-raised relative border border-border-visible overflow-hidden">
                <div className="absolute inset-0 hazard-stripes-dim opacity-20 pointer-events-none"></div>
                <div className="absolute inset-0 flex items-end justify-between px-xs pb-xs gap-[2px]">
                  {[40, 60, 30, 80, 50, 70, 20, 90, 45, 25, 65, 75].map((height, i) => (
                    <div key={i} className="flex-1 bg-border-visible" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
                <div className="absolute top-xs left-xs flex gap-sm">
                  <span className="label-text opacity-50">ID_042</span>
                  <span className="label-text opacity-50">ID_043</span>
                  <span className="label-text opacity-50">ID_044</span>
                </div>
              </div>
            </div>

            {/* RSA/PGP Status */}
            <div className="md:col-span-4 panel-border p-lg flex flex-col gap-xl relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-border-visible"></div>
              <div>
                 <h3 className="label-text mb-md">CLAVES_MAESTRAS</h3>
                <div className="flex flex-col gap-md">
                  <div className="flex items-center justify-between group cursor-pointer border border-border bg-surface p-sm">
                    <div className="flex items-center gap-md">
                      <span className="material-symbols-outlined text-success">vpn_key</span>
                      <div className="flex flex-col gap-[2px]">
                        <p className="font-mono text-caption text-text-primary">PGP_PRV_ALPHA</p>
                         <p className="font-mono text-[9px] text-text-disabled">VENCE: 2029.12.31</p>
                      </div>
                    </div>
                     <span className="label-text text-success bg-success/10 px-xs py-[2px] border border-success/30">ACTIVA</span>
                  </div>
                  <div className="flex items-center justify-between group cursor-pointer border border-border bg-surface p-sm">
                    <div className="flex items-center gap-md opacity-60">
                      <span className="material-symbols-outlined text-text-disabled">key_visualizer</span>
                      <div className="flex flex-col gap-[2px]">
                        <p className="font-mono text-caption text-text-secondary">RSA_4096_OFFLINE</p>
                         <p className="font-mono text-[9px] text-text-disabled">ALMACEN_FRIO_SEGURO</p>
                      </div>
                    </div>
                     <span className="label-text text-text-secondary border border-border-visible px-xs py-[2px]">FRIO</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto bg-surface-raised p-md border border-border-visible">
                <div className="flex justify-between items-center mb-sm">
                   <span className="label-text text-accent">ESTADO_OVERRIDE</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                </div>
                <p className="font-mono text-caption text-text-secondary leading-relaxed">
                   Los overrides de politica de seguridad estan actualmente DESHABILITADOS por protocolo de administrador.
                </p>
              </div>
            </div>

            {/* Global Activity Log */}
            <div className="md:col-span-4 panel-border p-lg">
               <h3 className="label-text mb-lg">ACCESOS_RECIENTES</h3>
              <div className="flex flex-col gap-lg">
                {accessLogs.map((log, i) => (
                  <div key={i} className={`relative pl-md border-l-2 ${
                    log.type === 'error' ? 'border-accent' : log.type === 'authorized' ? 'border-success' : 'border-border-visible'
                  }`}>
                    <p className={`font-mono text-caption ${
                      log.type === 'error' ? 'text-accent' : log.type === 'authorized' ? 'text-success' : 'text-text-secondary'
                    }`}>
                      [{log.time}]
                    </p>
                    <p className="font-mono text-caption text-text-primary mt-xs uppercase">{log.details}</p>
                    <p className="font-mono text-[10px] text-text-disabled mt-xs uppercase">
                       {log.hash !== 'ESTADO' && log.hash !== 'VERIFICADO' ? `HASH: ${log.hash}` : log.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Policy Override Panel */}
            <div className="md:col-span-8 panel-border p-xl flex flex-col gap-xl relative crosshairs">
              <div className="flex items-center justify-between">
                <div>
                   <h3 className="label-text text-text-primary">OVERRIDES_DE_POLITICA_DE_SEGURIDAD</h3>
                   <p className="font-mono text-caption text-text-disabled mt-xs">Elevacion manual de privilegios</p>
                </div>
                <span className="material-symbols-outlined text-text-disabled">priority_high</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                {overrides.map((override, i) => (
                  <div key={i} className="bg-surface-raised border border-border-visible p-md flex items-center justify-between hover:bg-border transition-all cursor-pointer">
                    <div className="flex items-center gap-md">
                      <span className={`material-symbols-outlined ${override.danger ? 'text-accent' : 'text-text-secondary'}`}>
                        {override.icon}
                      </span>
                      <span className="font-mono text-caption text-text-primary uppercase">{override.name}</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full relative border border-border-visible ${override.enabled ? (override.danger ? 'bg-accent/20' : 'bg-success/20') : 'bg-surface'}`}>
                      <div className={`absolute top-[2px] w-2.5 h-2.5 rounded-full transition-all ${
                        override.enabled 
                          ? override.danger ? 'right-1 bg-accent' : 'right-1 bg-success' 
                          : 'left-1 bg-text-disabled'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-lg border-t border-border-visible flex justify-between items-end">
                <div className="font-mono text-[9px] text-text-disabled">
                  COORD: 37.7749° N, 122.4194° W<br/>AUTH_SIG: DELTA_9_OMEGA
                </div>
                <div className="font-mono text-[9px] text-text-disabled uppercase">
                   ULTIMA_MODIFICACION: {new Date().toLocaleTimeString('es-AR', { hour12: false })} GMT
                </div>
              </div>
            </div>
            
          </div>

          {/* Bottom Tactical Feed */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-md mt-sm">
            {gridNodes.map((node, i) => (
              <div key={i} className={`panel-border p-md flex items-center gap-md ${node.dim ? 'opacity-40' : ''}`}>
                <div className="w-10 h-10 bg-surface-raised border border-border-visible flex items-center justify-center">
                  <span className="material-symbols-outlined text-text-primary">{node.icon}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-mono text-caption text-text-primary uppercase">{node.name}</p>
                  <p className="font-mono text-[9px] text-text-disabled">{node.status}</p>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>

    </div>
  );
}
