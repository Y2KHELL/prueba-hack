import { useState } from 'react'

const NuevoIngreso = ({ onCreated }) => {
  const [formData, setFormData] = useState({
    productor: '',
    finca: '',
    lote: '',
    cultivo: 'soya',
    variedad: 'TMG 7262 IPRO',
    peso_bruto: '',
    peso_tara: '',
    fecha_ingreso: new Date().toISOString().split('T')[0],
    hora_ingreso: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = () => {
    const errors = {}
    if (!formData.productor.trim()) errors.productor = 'Requerido'
    if (!formData.finca.trim()) errors.finca = 'Requerido'
    if (!formData.lote.trim()) errors.lote = 'Requerido'
    if (!formData.peso_bruto || Number(formData.peso_bruto) <= 0) errors.peso_bruto = 'Debe ser mayor a 0'
    if (!formData.peso_tara || Number(formData.peso_tara) < 0) errors.peso_tara = 'No puede ser negativo'
    if (Number(formData.peso_tara) >= Number(formData.peso_bruto)) errors.peso_tara = 'Debe ser menor al peso bruto'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!validate()) return

    setLoading(true)
    const peso_neto = Number(formData.peso_bruto) - Number(formData.peso_tara)

    try {
      const response = await fetch('/api/intakes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, peso_neto, estado: 'pendiente' }),
      })
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Error al registrar ingreso')
      }
      const data = await response.json()
      onCreated?.(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const peso_neto = formData.peso_bruto && formData.peso_tara
    ? Number(formData.peso_bruto) - Number(formData.peso_tara)
    : null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-[#1F2A24] mb-1">Nuevo Ingreso de Cami&oacute;n</h3>
      <p className="text-sm text-gray-500 mb-6">Registra el ingreso de soya al acopio</p>
      {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Productor</label>
            <input type="text" value={formData.productor} onChange={(e) => setFormData({...formData, productor: e.target.value})} className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#008C45] focus:border-transparent outline-none ${fieldErrors.productor ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Ej: Juan Perez" />
            {fieldErrors.productor && <p className="text-xs text-red-500 mt-1">{fieldErrors.productor}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Finca / Origen</label>
            <input type="text" value={formData.finca} onChange={(e) => setFormData({...formData, finca: e.target.value})} className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#008C45] focus:border-transparent outline-none ${fieldErrors.finca ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Ej: San Pedro" />
            {fieldErrors.finca && <p className="text-xs text-red-500 mt-1">{fieldErrors.finca}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lote</label>
            <input type="text" value={formData.lote} onChange={(e) => setFormData({...formData, lote: e.target.value})} className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#008C45] focus:border-transparent outline-none ${fieldErrors.lote ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Ej: LOT-2026-001" />
            {fieldErrors.lote && <p className="text-xs text-red-500 mt-1">{fieldErrors.lote}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Variedad</label>
            <select value={formData.variedad} onChange={(e) => setFormData({...formData, variedad: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#008C45] focus:border-transparent outline-none">
              <option value="TMG 7262 IPRO">TMG 7262 IPRO</option>
              <option value="Don Mario 68i68">Don Mario 68i68</option>
              <option value="Nidera 6860">Nidera 6860</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Peso Bruto (kg)</label>
            <input type="number" min="0" value={formData.peso_bruto} onChange={(e) => setFormData({...formData, peso_bruto: e.target.value})} className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#008C45] focus:border-transparent outline-none ${fieldErrors.peso_bruto ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Ej: 32000" />
            {fieldErrors.peso_bruto && <p className="text-xs text-red-500 mt-1">{fieldErrors.peso_bruto}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Peso Tara (kg)</label>
            <input type="number" min="0" value={formData.peso_tara} onChange={(e) => setFormData({...formData, peso_tara: e.target.value})} className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#008C45] focus:border-transparent outline-none ${fieldErrors.peso_tara ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Ej: 8500" />
            {fieldErrors.peso_tara && <p className="text-xs text-red-500 mt-1">{fieldErrors.peso_tara}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
            <input type="date" value={formData.fecha_ingreso} onChange={(e) => setFormData({...formData, fecha_ingreso: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#008C45] focus:border-transparent outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Ingreso</label>
            <input type="time" value={formData.hora_ingreso} onChange={(e) => setFormData({...formData, hora_ingreso: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#008C45] focus:border-transparent outline-none" />
          </div>
        </div>

        {peso_neto !== null && peso_neto > 0 && (
          <div className="bg-[#008C45]/5 border border-[#008C45]/20 rounded-lg p-4">
            <p className="text-sm text-gray-600">Peso Neto:</p>
            <p className="text-2xl font-bold text-[#008C45]">{peso_neto} kg</p>
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-[#008C45] text-white py-3 rounded-lg font-semibold hover:bg-[#064E2E] transition-colors disabled:opacity-50">
          {loading ? 'Registrando...' : 'Registrar Ingreso'}
        </button>
      </form>
    </div>
  )
}

export default NuevoIngreso