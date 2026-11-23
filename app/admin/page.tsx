"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Cliente {
  dni: string;
  nombre_completo: string;
  puntos_acumulados: number;
}

export default function Home() {
  const [ranking, setRanking] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerTop10 = async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("dni, nombre_completo, puntos_acumulados")
        .order("puntos_acumulados", { ascending: false })
        .order("creado_en", { ascending: true })
        .limit(10);

      if (!error && data) {
        setRanking(data);
      }
      setCargando(false);
    };

    obtenerTop10();
  }, []);

  // Oculta los primeros 4 dígitos del DNI por privacidad (ej: ****8157)
  const enmascararDni = (dni: string) => {
    if (!dni || dni.length < 4) return "****";
    return "****" + dni.slice(-4);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Cabecera estilo Repsol */}
        <div className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 p-6 text-center">
          <span className="inline-block bg-black/30 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">
            Sorteo Finalizado
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow">
            ¡SE CERRÓ EL SORTEO!
          </h1>
        </div>

        {/* Mensaje principal de aviso */}
        <div className="p-6 text-center border-b border-slate-800 bg-slate-900/80">
          <p className="text-lg sm:text-xl font-semibold text-orange-400 mb-2">
            🏆 Acércate a nuestra estación a reclamar tu premio
          </p>
          <p className="text-sm text-slate-300">
            El registro de códigos ha finalizado. Si figuras en la tabla oficial de ganadores, presenta tu <strong>DNI físico</strong> en caja para validar tu premio.
          </p>
        </div>

        {/* Tabla del Top 10 Ranking */}
        <div className="p-6">
          <h2 className="text-center text-lg font-bold text-white mb-4 flex items-center justify-center gap-2">
            <span>🏅</span> TABLA OFICIAL - TOP 10 RANKING
          </h2>

          {cargando ? (
            <p className="text-center text-slate-400 py-6">Cargando resultados oficiales...</p>
          ) : ranking.length === 0 ? (
            <p className="text-center text-slate-400 py-6">No hay participantes registrados.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/90 text-xs uppercase text-slate-300 border-b border-slate-700">
                    <th className="py-3 px-3 text-center">Puesto</th>
                    <th className="py-3 px-3">Participante</th>
                    <th className="py-3 px-3 text-center">DNI</th>
                    <th className="py-3 px-3 text-right">Puntos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {ranking.map((cliente, index) => {
                    const esTop3 = index < 3;
                    const medalla =
                      index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;

                    return (
                      <tr
                        key={cliente.dni + index}
                        className={
                          index === 0
                            ? "bg-amber-500/15 font-semibold"
                            : esTop3
                            ? "bg-slate-800/40"
                            : "hover:bg-slate-800/30"
                        }
                      >
                        <td className="py-3 px-3 text-center font-bold text-base">
                          {medalla}
                        </td>
                        <td className="py-3 px-3 uppercase truncate max-w-[160px]">
                          {cliente.nombre_completo}
                        </td>
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-xs">
                          {enmascararDni(cliente.dni)}
                        </td>
                        <td className="py-3 px-3 text-right font-extrabold text-orange-400">
                          {cliente.puntos_acumulados} pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}