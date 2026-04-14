import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react';

import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar'

const connections = [
  { ip: '192.168.1.104', port: '443', protocol: 'TCP', status: 'AUTORIZADO', type: 'authorized' },
  { ip: '45.231.12.8', port: '22', protocol: 'SSH', status: 'DENEGADO', type: 'error' },
  { ip: '10.0.0.44', port: '8080', protocol: 'HTTP', status: 'PENDIENTE', type: 'pending' },
  { ip: '172.16.254.1', port: '1194', protocol: 'VPN', status: 'CIFRADO', type: 'authorized' },
]

const peripherals = [
  { name: 'Puerta Enlace 01', status: 'EN_LINEA', icon: 'router' },
  { name: 'Servidor A-9', status: 'ESTABLE', icon: 'memory' },
  { name: 'Arreglo Comms', status: 'INACTIVO', icon: 'cell_tower' },
  { name: 'Boveda-02', status: 'COMPROMETIDO', icon: 'warning', danger: true },
]

export default function NetworkScanner() {
  const navigate = useNavigate()
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate('/', { replace: true })
    }
  }, [currentUser, navigate])

  return (
    <div className="flex flex-col h-screen bg-background text-text-primary overflow-hidden font-body relative">
      <TopBar title="ESCANER_RED" />

      <div className="absolute inset-0 dot-grid-subtle opacity-20 pointer-events-none z-0"></div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-xl z-10">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-xl pb-xl">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-xl border-b border-border-visible pb-md">
            <div className="flex flex-col gap-sm">
              <span className="label-text flex items-center gap-xs text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                 SYS.TELEMETRIA // ESCANEO_GLOBAL
              </span>
              <h1 className="font-display text-display-lg text-text-display mt-xs uppercase">
                 TELEMETRIA
              </h1>
            </div>
            
            <div className="flex flex-col items-end gap-xs">
               <span className="label-text text-text-secondary">FUERZA_CIFRADO</span>
              <div className="flex gap-[2px] mt-xs">
                {[true, true, true, true, false, false].map((filled, i) => (
                  <div key={i} className={`h-md w-xs ${filled ? 'bg-text-primary' : 'bg-border-visible'}`}></div>
                ))}
              </div>
              <span className="font-mono text-caption text-text-primary mt-xs">AES-4096-CTR</span>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-md">
            
            {/* Central Map Visualization */}
            <div className="md:col-span-8 md:row-span-2 panel-border relative min-h-[400px] crosshairs">
              <div className="absolute inset-0 opacity-10 mix-blend-screen bg-no-repeat bg-cover grayscale" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCpb82Fbq3SbNMDGx1B21XlkSjweF6zw1RTscaVYMLLb8D63HvHjy3TWOXRaGxtZGbzsv0gUF_62YFYi6-mmI_8dxtc_GA4Q3rDWxznhYpCKeb82ox9QrVODhghRHnS5eRGaTiVC4coYsmHEuLmNOfhoh-fCjbeW_mcS6KzLZB4_-O-Rt7u6vAmgS8dmhTU2dagzDsTrU1boIJP71-PUrzGXt_kX7Tc40NaV_6IOcFvAthEbHj0O9dJtpL4Gcef2v1MOcF_p0ThUoY')" }}>
              </div>
              
              <div className="absolute top-md left-md z-10 border border-border-visible bg-background/80 backdrop-blur-sm p-md">
                 <h3 className="label-text text-text-primary mb-sm">CLUSTER_NODOS_04</h3>
                <div className="flex gap-xl">
                  <div className="flex flex-col">
                     <span className="label-text text-text-secondary">TIEMPO_ACTIVO</span>
                    <span className="font-mono text-body text-text-primary mt-[2px]">99.982%</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="label-text text-text-secondary">PARES_ACTIVOS</span>
                    <span className="font-mono text-body text-text-primary mt-[2px]">14,892</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-md right-md z-10 flex gap-md">
                <button className="border border-border-visible hover:bg-surface-raised bg-background px-md py-sm font-mono text-label uppercase tracking-widest text-text-primary transition-all">
                   EXPANDIR_MAPA
                </button>
                <button className="bg-text-primary text-background hover:bg-text-secondary px-md py-sm font-mono text-label uppercase tracking-widest transition-all">
                   AISLAR_NODO
                </button>
              </div>

              <div className="scanline animate-scan"></div>
            </div>

            {/* Signal Integrity Graph */}
            <div className="md:col-span-4 panel-border p-lg flex flex-col gap-lg relative overflow-hidden">
              <div className="flex justify-between items-start z-10">
                 <h3 className="label-text text-text-primary">INTEGRIDAD_SENAL</h3>
                <span className="material-symbols-outlined text-[20px] text-text-secondary">trending_up</span>
              </div>
              
              <div className="flex-1 flex items-end gap-[2px] min-h-[120px] mt-md border-b border-border-visible pb-xs z-10">
                {[40, 65, 30, 85, 55, 70, 45, 90].map((height, i) => (
                  <div key={i} className="flex-1 bg-text-disabled hover:bg-text-primary transition-colors cursor-crosshair" style={{ height: `${height}%`, opacity: 0.4 + i * 0.05 }}></div>
                ))}
              </div>
              
              <div className="flex justify-between mt-sm z-10">
                <div className="flex flex-col">
                     <span className="label-text text-text-secondary">PERDIDA_PAQUETES</span>
                  <span className="font-mono text-heading text-accent mt-xs">0.004%</span>
                </div>
                <div className="flex flex-col items-end">
                     <span className="label-text text-text-secondary">LATENCIA</span>
                  <span className="font-mono text-heading text-text-primary mt-xs">12ms</span>
                </div>
              </div>
            </div>

            {/* Active Connections Log */}
            <div className="md:col-span-4 panel-border p-lg flex flex-col gap-md h-[300px]">
              <div className="flex justify-between items-center mb-sm border-b border-border-visible pb-sm">
                 <h3 className="label-text text-text-primary">REGISTRO_CONEXIONES</h3>
                <span className="label-text text-text-secondary">UTC {new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
              </div>
              
              <div className="flex flex-col gap-xs overflow-y-auto custom-scrollbar pr-xs">
                {connections.map((conn, i) => (
                  <div key={i} className={`flex flex-col gap-xs p-sm border-l-2 bg-surface ${
                    conn.type === 'error' ? 'border-accent' : conn.type === 'pending' ? 'border-border-visible' : 'border-success'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-caption text-text-primary">{conn.ip}</span>
                      <span className={`label-text ${
                        conn.type === 'error' ? 'text-accent' : conn.type === 'pending' ? 'text-text-disabled' : 'text-success'
                      }`}>{conn.status}</span>
                    </div>
                    <span className="font-mono text-[10px] text-text-secondary">PORT:{conn.port} // {conn.protocol}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Metrics Cluster */}
            <div className="md:col-span-4 panel-border p-lg flex flex-col gap-lg">
               <h3 className="label-text text-text-primary">FLUJO_TELEMETRIA</h3>
              
              <div className="flex flex-col gap-md">
                <div className="flex flex-col gap-sm">
                  <div className="flex justify-between items-center">
                     <span className="label-text text-text-secondary">CARGA_PROCESADOR</span>
                    <span className="font-mono text-caption text-text-primary">44.2%</span>
                  </div>
                  <div className="h-[2px] w-full bg-border-visible overflow-hidden">
                    <div className="h-full bg-text-primary" style={{ width: '44.2%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-sm">
                  <div className="flex justify-between items-center">
                     <span className="label-text text-text-secondary">BUFFER_MEMORIA</span>
                    <span className="font-mono text-caption text-text-primary">12.8 GB</span>
                  </div>
                  <div className="h-[2px] w-full bg-border-visible overflow-hidden">
                    <div className="h-full bg-text-primary" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-sm">
                  <div className="flex justify-between items-center">
                     <span className="label-text text-text-secondary">VELOCIDAD_TUNEL</span>
                    <span className="font-mono text-caption text-text-primary">2.4 GB/s</span>
                  </div>
                  <div className="h-[2px] w-full bg-border-visible overflow-hidden">
                    <div className="h-full bg-text-disabled" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-md border-t border-border-visible flex items-center justify-between">
                <div className="flex flex-col gap-[2px]">
                   <span className="label-text text-text-primary">INTEGRIDAD_KERNEL</span>
                   <span className="font-mono text-[9px] text-text-secondary">ULTIMO_CHECK: HACE_2M</span>
                </div>
                <span className="label-text text-success bg-success/10 px-xs py-[2px] border border-success/30">OK</span>
              </div>
            </div>

            {/* Peripheral Control Unit */}
            <div className="md:col-span-8 panel-border p-lg flex flex-col gap-lg">
              <div className="flex justify-between items-center border-b border-border-visible pb-sm">
                 <h3 className="label-text text-text-primary">HUB_PERIFERICOS</h3>
                 <span className="label-text text-text-secondary">12_NODOS_CONECTADOS</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
                {peripherals.map((p, i) => (
                  <div key={i} className={`p-md flex flex-col items-center justify-center gap-md border cursor-pointer transition-colors ${
                    p.danger ? 'border-accent bg-accent/5 hover:bg-accent/10' : 'border-border-visible bg-surface hover:bg-surface-raised hover:border-text-disabled'
                  }`}>
                    <span className={`material-symbols-outlined text-[24px] ${p.danger ? 'text-accent' : 'text-text-primary'}`}>
                      {p.icon}
                    </span>
                    <div className="flex flex-col items-center gap-[2px]">
                      <span className="font-mono text-caption text-text-primary text-center">{p.name}</span>
                      <span className={`font-mono text-[9px] ${p.danger ? 'text-accent' : 'text-text-secondary'}`}>{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
