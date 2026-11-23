'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Cliente {
  id: string;
  dni: string;
  nombre_completo: string;
  puntos_acumulados: number;
  creado_en: string;
}

interface Consumo {
  id: string;
  puntos_ganados: number;
  fecha: string;
  clientes: { dni: string; nombre_completo: string } | null;
  codigos_consumo: { codigo: string } | null;
}

export default function AdminDashboard() {
  const [topClientes, setTopClientes] = useState<Cliente[]>([]);
  const [consumos, setConsumos] = useState<Consumo[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = async () => {
    setCargando(true);
    
    // TOP 10 clientes con más puntos acumulados
    const { data: dataClientes } = await supabase
      .from('clientes')
      .select('*')
      .order('puntos_acumulados', { ascending: false })
      .limit(10);

    // Historial de los últimos 20 canjes realizados
    const { data: dataConsumos } = await supabase
      .from('historial_consumos')
      .select('id, puntos_ganados, fecha, clientes(dni, nombre_completo), codigos_consumo(codigo)')
      .order('fecha', { ascending: false })
      .limit(20);

    if (dataClientes) setTopClientes(dataClientes);
    if (dataConsumos) setConsumos(dataConsumos as any);
    setCargando(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
            <p className="text-slate-400 text-sm mt-1">Visualización de puntos acumulados por DNI y registros</p>
          </div>
          <button
            onClick={cargarDatos}
            className="bg-blue-600 hover:bg-blue-500 active:scale-95 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg"
          >
            {cargando ? 'CARGANDO...' : 'RECARGAR DATOS'}
          </button>
        </div>

        {/* TABLA: TOP 10 MEJORES CLIENTES */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
              🏆 RANKING TOP 10 CLIENTES
            </h2>
            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-bold">
              Ordenado por Puntos Acumulados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="p-3 text-center">Posición</th>
                  <th className="p-3">DNI / Documento</th>
                  <th className="p-3">Nombre Completo</th>
                  <th className="p-3 text-right">Puntos Totales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {topClientes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-500">
                      Aún no hay clientes registrados.
                    </td>
                  </tr>
                ) : (
                  topClientes.map((c, index) => (
                    <tr key={c.id} className="hover:bg-slate-700/50 transition-colors">
                      <td className="p-3 text-center font-black text-slate-400">
                        {index === 0 && '🥇 1°'}
                        {index === 1 && '🥈 2°'}
                        {index === 2 && '🥉 3°'}
                        {index > 2 && `#${index + 1}`}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-200">{c.dni}</td>
                      <td className="p-3 font-bold uppercase">{c.nombre_completo}</td>
                      <td className="p-3 text-right">
                        <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-xl font-black text-base border border-emerald-500/30">
                          {c.puntos_acumulados} PTS
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLA: ÚLTIMOS CANJES REGISTRADOS */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-blue-400">Historial Reciente de Canjes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="p-3">DNI</th>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Código Ingresado</th>
                  <th className="p-3">Puntos Sumados</th>
                  <th className="p-3">Fecha y Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {consumos.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-300">{h.clientes?.dni || 'N/A'}</td>
                    <td className="p-3 font-bold uppercase">{h.clientes?.nombre_completo || 'N/A'}</td>
                    <td className="p-3 font-mono text-amber-400 font-bold">{h.codigos_consumo?.codigo || 'N/A'}</td>
                    <td className="p-3 font-bold text-emerald-400">+{h.puntos_ganados} PTS</td>
                    <td className="p-3 text-slate-400">
                      {new Date(h.fecha).toLocaleString('es-PE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}