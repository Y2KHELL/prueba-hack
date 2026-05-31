import { useState, useEffect } from 'react'

const RecepcionTecnica = ({ intakeId, onComplete }) => {
  const [intake, setIntake] = useState(null)
  const [checklist, setChecklist] = useState({
    documentacion_completa: false,
    peso_verificado: false,
    estado_fresco: false,
    sin_olores_extraños: false,
    temperatura_aceptable: false,
  })
  const [observaciones, setObservaciones] = useState('')

  useEffect(() => {
    if (intakeId) {
      fetch(`/api/intakes/${intakeId}`)
        .then((res) => res.json())
        .then(setIntake)
    }
  }, [intakeId])

  const handleCheck = (key) => {
    setChecklist({ ...checklist, [key]: !checklist[key] })
  }

  const allChecked = Object.values(checklist).every(Boolean)

  const handleSubmit = () => {
    const estado = allChecked ? 'recepcionado' : 'observacion'
    onComplete?.({ checklist, observaciones, estado })
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Recepción Técnica</h3>

      {intake && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600">
            Ingreso: <span className="font-medium">{intake.id}</span>
          </p>
          <p className="text-sm text-gray-600">
            Productor: <span className="font-medium">{intake.productor}</span>
          </p>
          <p className="text-sm text-gray-600">
            Peso Neto: <span className="font-medium">{intake.peso_neto} kg</span>
          </p>
        </div>
      )}

      <div className="space-y-3 mb-4">
        {Object.entries(checklist).map(([key, value]) => (
          <label key={key} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={() => handleCheck(key)}
              className="w-5 h-5 rounded border-gray-300"
            />
            <span className="text-sm capitalize">
              {key.replace(/_/g, ' ')}
            </span>
          </label>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones
        </label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 h-20"
          placeholder="Notas adicionales..."
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allChecked}
        className={`w-full py-2 rounded-lg font-semibold ${
          allChecked
            ? 'bg-soy-green text-white hover:bg-soy-green-dark'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {allChecked ? 'Aprobar Recepción' : 'Complete todos los items'}
      </button>
    </div>
  )
}

export default RecepcionTecnica
