import { useState, useEffect } from 'react'

const ResultadoIA = ({ imageData, cultivo, onResult }) => {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyze = async () => {
    if (!imageData) { setError('No hay imagen para analizar'); return }
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/reports/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageData, cultivo }),
      })
      const data = await response.json()
      setResult(data)
      onResult?.(data)
    } catch (err) {
      setError('Error al analizar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (imageData) analyze() }, [imageData])

  if (loading) return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-[#008C45] rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-500">Analizando con Gemini...</p>
    </div>
  )

  if (error) return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <p className="text-red-500 text-center mb-3">{error}</p>
      <button onClick={analyze} className="w-full text-sm text-[#008C45] hover:underline">Reintentar</button>
    </div>
  )

  if (!result) return null

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-xl font-bold text-[#1F2A24] mb-4">Resultado Analisis IA</h3>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-400 uppercase mb-1">Calidad</p>
          <p className="text-lg font-bold text-[#1F2A24] uppercase">{result.calidad || 'N/A'}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-400 uppercase mb-1">Puntuacion</p>
          <p className="text-lg font-bold text-[#1F2A24]">{result.puntuacion || 0}/100</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-400 uppercase mb-1">Recomendacion</p>
          <p className="text-lg font-bold text-[#1F2A24] capitalize">{result.recomendacion || 'N/A'}</p>
        </div>
        {result.penalty_info && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-400 uppercase mb-1">Descuento</p>
            <p className="text-lg font-bold text-[#1F2A24]">{result.penalty_info.descuento_porcentaje || 0}%</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4 text-center">
        <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-400">Sanos</p><p className="text-sm font-bold text-[#1F2A24]">{result.sanoPct || 0}%</p></div>
        <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-400">Partidos</p><p className="text-sm font-bold text-[#1F2A24]">{result.partidoPct || 0}%</p></div>
        <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-400">Manchados</p><p className="text-sm font-bold text-[#1F2A24]">{result.manchadoPct || 0}%</p></div>
        <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-400">Moho</p><p className="text-sm font-bold text-[#1F2A24]">{result.mohoPct || 0}%</p></div>
        <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-400">Impurezas</p><p className="text-sm font-bold text-[#1F2A24]">{result.impurezasPct || 0}%</p></div>
      </div>

      {result.defectos?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">Defectos:</p>
          <div className="flex flex-wrap gap-2">
            {result.defectos.map((d, i) => (
              <span key={i} className="bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded text-xs">{d}</span>
            ))}
          </div>
        </div>
      )}

      {result.observaciones && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Observaciones</p>
          <p className="text-sm text-[#1F2A24]">{result.observaciones}</p>
        </div>
      )}

      {result.demo && (
        <div className="mt-4 bg-[#D6A03A]/10 border border-[#D6A03A]/30 rounded-lg p-3">
          <p className="text-xs text-[#1F2A24]">Modo demo. Configure GEMINI_API_KEY para analisis real.</p>
        </div>
      )}
    </div>
  )
}

export default ResultadoIA
