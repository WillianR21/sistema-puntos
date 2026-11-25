'use client';

import { useState } from 'react';
import { supabase } from './lib/supabase';

export default function Home() {
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setCargando(true);

    try {
      const { data, error } = await supabase.rpc('procesar_canje', {
        p_dni: dni.trim().toUpperCase(),
        p_nombre: nombre.trim().toUpperCase(),
        p_codigo: codigo.trim().toUpperCase(),
      });

      if (error) throw error;

      const resultado = data[0];
      if (resultado.exito) {
        setMensaje({ tipo: 'exito', texto: resultado.mensaje });
        setCodigo('');
      } else {
        setMensaje({ tipo: 'error', texto: resultado.mensaje });
      }
    } catch (err: any) {
      setMensaje({ tipo: 'error', texto: 'Ocurrió un error inesperado. Inténtalo de nuevo.' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">¡GANA PUNTOS!</h1>
          <p className="text-slate-400 text-sm mt-1">Ingresa tus datos para registrar tu consumo</p>
        </div>

        {mensaje && (
          <div className={`p-4 rounded-2xl text-center font-bold text-sm ${
            mensaje.tipo === 'exito' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
          }`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">DNI / DOCUMENTO</label>
            <input
              type="text"
              required
              pattern="[0-9]{8,15}"
              placeholder="EJ. 70809010"
              value={dni}
              onChange={(e) => setDni(e.target.value.toUpperCase())}
              className="w-full px-4 py-4 rounded-2xl bg-slate-900 border border-slate-700 text-white font-bold text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">NOMBRE COMPLETO</label>
            <input
              type="text"
              required
              placeholder="EJ. JUAN PÉREZ"
              value={nombre}
              onChange={(e) => setNombre(e.target.value.toUpperCase())}
              className="w-full px-4 py-4 rounded-2xl bg-slate-900 border border-slate-700 text-white font-bold text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">CÓDIGO DE CONSUMO</label>
            <input
              type="text"
              required
              placeholder="EJ. PROMO50"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              className="w-full px-4 py-4 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black py-5 rounded-2xl shadow-lg transition-all text-xl uppercase tracking-wider disabled:opacity-50 mt-4"
          >
            {cargando ? 'PROCESANDO...' : 'CANJEAR MIS PUNTOS'}
          </button>
        </form>
      </div>
    </main>
  );
}