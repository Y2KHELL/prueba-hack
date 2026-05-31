import { useState, useEffect } from 'react'

const AcopioDashboard = () => {
  const [intakes, setIntakes] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/intakes').then(r => { if (!r.ok) throw new Error('Error al cargar ingresos'); return r.json() }),
      fetch('/api/reports/summary').then(r => { if (!r.ok) throw new Error('Error al cargar resumen'); return r.json() }),
    ]).then(([i, s]) => { setIntakes(Array.isArray(i) ? i : []); setSummary(s); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  if (loading) return <div className="text-center py-12"><div className="w-5 h-5 border-2 border-gray-300 border-t-[#008C45] rounded-full animate-spin mx-auto"></div></div>
  if (error) return <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{error}</div>

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#1F2A24] mb-1">Acopio</h1>
      <p className="text-sm text-gray-400 mb-6">Recepci&oacute;n y an&aacute;lisis de calidad</p>

      {summary && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center"><p className="text-2xl font-bold text-[#1F2A24]">{summary.total_ingresos}</p><p className="text-xs text-gray-400 uppercase">Ingresos</p></div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center"><p className="text-2xl font-bold text-[#008C45]">{summary.aprobados}</p><p className="text-xs text-gray-400 uppercase">Aprobados</p></div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center"><p className="text-2xl font-bold text-red-500">{summary.rechazados}</p><p className="text-xs text-gray-400 uppercase">Rechazados</p></div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center"><p className="text-2xl font-bold text-[#D6A03A]">{summary.tasa_aprobacion}%</p><p className="text-xs text-gray-400 uppercase">Aprobaci&oacute;n</p></div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-[#1F2A24]">&Uacute;ltimos Ingresos</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {intakes.map((i) => (
            <div key={i.id} className="px-4 py-2.5 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full ${i.estado === 'aprobado' ? 'bg-[#008C45]' : i.estado === 'rechazado' ? 'bg-red-500' : 'bg-[#D6A03A]'}`}></div>
                <div>
                  <p className="text-sm font-medium text-[#1F2A24]">{i.productor}</p>
                  <p className="text-[10px] text-gray-400">{i.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#1F2A24]">{i.peso_neto || i.peso_toneladas || '--'} kg</p>
                <p className={`text-[10px] ${i.estado === 'aprobado' ? 'text-[#008C45]' : i.estado === 'rechazado' ? 'text-red-500' : 'text-[#D6A03A]'}`}>{i.estado}</p>
              </div>
            </div>
          ))}
          {intakes.length === 0 && <p className="p-6 text-center text-gray-400 text-sm">Sin ingresos</p>}
        </div>
      </div>
    </div>
  )
}

export default AcopioDashboard