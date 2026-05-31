import { useState, useEffect } from 'react'

const Castigo = ({ calidad, defectos, cultivo, onComplete }) => {
  const [penaltyInfo, setPenaltyInfo] = useState(null)

  useEffect(() => {
    fetch('/api/reports/penalty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ calidad, defectos, cultivo }),
    }).then(r => r.json()).then(setPenaltyInfo).catch(() => {})
  }, [calidad, defectos, cultivo])

  if (!penaltyInfo) return <div className="bg-white border border-gray-200 rounded-xl p-6"><p className="text-gray-500">Calculando...</p></div>

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-xl font-bold text-[#1F2A24] mb-4">Penalizacion</h3>

      <div className={`border rounded-lg p-4 mb-4 ${penaltyInfo.recomendacion === 'sin_penalizacion' ? 'border-[#008C45]/30 bg-[#008C45]/5' : penaltyInfo.recomendacion === 'rechazar_lote' ? 'border-red-300 bg-red-50' : 'border-[#D6A03A]/30 bg-[#D6A03A]/5'}`}>
        <p className="font-semibold text-[#1F2A24] capitalize">{penaltyInfo.recomendacion.replace(/_/g, ' ')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-[#1F2A24]">{penaltyInfo.penalizacion_puntos}</p>
          <p className="text-xs text-gray-400">Puntos</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-[#1F2A24]">{penaltyInfo.descuento_porcentaje}%</p>
          <p className="text-xs text-gray-400">Descuento</p>
        </div>
      </div>

      {penaltyInfo.defectos_graves?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-1">Graves:</p>
          <div className="flex flex-wrap gap-2">
            {penaltyInfo.defectos_graves.map((d, i) => (
              <span key={i} className="bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded text-xs">{d}</span>
            ))}
          </div>
        </div>
      )}

      {penaltyInfo.defectos_menores?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-1">Menores:</p>
          <div className="flex flex-wrap gap-2">
            {penaltyInfo.defectos_menores.map((d, i) => (
              <span key={i} className="bg-[#D6A03A]/10 text-[#D6A03A] border border-[#D6A03A]/30 px-2 py-1 rounded text-xs">{d}</span>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => onComplete?.(penaltyInfo)} className="w-full mt-4 bg-[#008C45] text-white py-3 rounded-lg font-semibold hover:bg-[#064E2E] transition-colors">
        Generar Reporte
      </button>
    </div>
  )
}

export default Castigo
