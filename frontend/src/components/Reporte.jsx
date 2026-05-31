const Reporte = ({ intake, iaResult, penaltyInfo }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#1F2A24]">Reporte de Calidad</h3>
        <button onClick={() => window.print()} className="text-sm text-[#008C45] hover:underline">Imprimir</button>
      </div>

      <div className="border-b border-gray-100 pb-4 mb-4">
        <h4 className="font-semibold text-[#1F2A24] mb-2">Ingreso</h4>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <p><span className="text-gray-400">ID:</span> <span className="text-[#1F2A24] font-medium">{intake?.id || 'N/A'}</span></p>
          <p><span className="text-gray-400">Productor:</span> <span className="text-[#1F2A24] font-medium">{intake?.productor || 'N/A'}</span></p>
          <p><span className="text-gray-400">Cultivo:</span> <span className="text-[#1F2A24] font-medium">{intake?.cultivo || 'soya'}</span></p>
          <p><span className="text-gray-400">Peso:</span> <span className="text-[#1F2A24] font-medium">{intake?.peso_neto || intake?.peso_toneladas || 'N/A'} kg</span></p>
          <p><span className="text-gray-400">Humedad:</span> <span className="text-[#1F2A24] font-medium">{intake?.humedadMedida || 'N/A'}%</span></p>
          <p><span className="text-gray-400">Fecha:</span> <span className="text-[#1F2A24] font-medium">{intake?.fecha_ingreso || 'N/A'}</span></p>
        </div>
      </div>

      {iaResult && (
        <div className="border-b border-gray-100 pb-4 mb-4">
          <h4 className="font-semibold text-[#1F2A24] mb-2">Analisis IA</h4>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <p><span className="text-gray-400">Calidad:</span> <span className="text-[#1F2A24] font-medium uppercase">{iaResult.calidad}</span></p>
            <p><span className="text-gray-400">Puntuacion:</span> <span className="text-[#1F2A24] font-medium">{iaResult.puntuacion}/100</span></p>
            <p><span className="text-gray-400">Recomendacion:</span> <span className="text-[#1F2A24] font-medium capitalize">{iaResult.recomendacion}</span></p>
          </div>
        </div>
      )}

      {penaltyInfo && (
        <div className="border-b border-gray-100 pb-4 mb-4">
          <h4 className="font-semibold text-[#1F2A24] mb-2">Penalizacion</h4>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <p><span className="text-gray-400">Puntos:</span> <span className="text-[#1F2A24] font-medium">{penaltyInfo.penalizacion_puntos}</span></p>
            <p><span className="text-gray-400">Descuento:</span> <span className="text-[#1F2A24] font-medium">{penaltyInfo.descuento_porcentaje}%</span></p>
            <p><span className="text-gray-400">Decision:</span> <span className="text-[#1F2A24] font-medium capitalize">{penaltyInfo.recomendacion.replace(/_/g, ' ')}</span></p>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400 text-right mt-4">
        Generado por AgroSoya - {new Date().toLocaleDateString('es-ES')}
      </div>
    </div>
  )
}

export default Reporte
