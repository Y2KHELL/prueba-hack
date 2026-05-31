import { useState, useEffect } from 'react'

const ZONAS_DATA = {
  'Cuatro Cañadas': { suelo: 'Alto', tempProm: 29, rendimiento: 2.5, region: 'Este', ha: 120000 },
  'Pailón': { suelo: 'Medio', tempProm: 28, rendimiento: 2.3, region: 'Este', ha: 85000 },
  'San Julián': { suelo: 'Alto', tempProm: 28, rendimiento: 2.2, region: 'Este', ha: 70000 },
  'San Pedro': { suelo: 'Bueno', tempProm: 27, rendimiento: 2.4, region: 'Norte', ha: 55000 },
  'Montero': { suelo: 'Medio', tempProm: 28, rendimiento: 2.3, region: 'Norte', ha: 65000 },
  'Okinawa': { suelo: 'Alto', tempProm: 27, rendimiento: 2.8, region: 'Norte', ha: 30000 },
  'Cabezas': { suelo: 'Regular', tempProm: 27, rendimiento: 2.1, region: 'Sur', ha: 90000 },
  'Charagua': { suelo: 'Regular', tempProm: 26, rendimiento: 1.8, region: 'Sur', ha: 50000 },
}

const CampoDashboard = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ nombre: '', zona: '', hectareas: '', tipoSuelo: 'Medio', fechaSiembra: '', semilla: 'TMG 7262 IPRO' })
  const [formErrors, setFormErrors] = useState({})

  const fetchC = () => {
    fetch('/api/campaigns/')
      .then(r => { if (!r.ok) throw new Error('Error al cargar campañas'); return r.json() })
      .then(d => { setCampaigns(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }
  useEffect(() => { fetchC() }, [])

  const handleZona = (z) => { const zd = ZONAS_DATA[z]; setForm({ ...form, zona: z, tipoSuelo: zd ? zd.suelo : form.tipoSuelo }) }
  const fmt = (d) => { if (!d) return ''; const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}` }

  const validateForm = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'Requerido'
    if (!form.zona) e.zona = 'Seleccioná una zona'
    if (!form.hectareas || Number(form.hectareas) <= 0) e.hectareas = 'Debe ser mayor a 0'
    if (!form.fechaSiembra) e.fechaSiembra = 'Requerido'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    const zd = ZONAS_DATA[form.zona] || {}
    const ha = Number(form.hectareas) || 0
    const costos = { semilla: Math.round(ha * 54), fertilizante: Math.round(ha * 24), herbicida: Math.round(ha * 10), fungicida: Math.round(ha * 8), insecticida: Math.round(ha * 6), maquinaria: Math.round(ha * 32), transporte: Math.round(ha * 18) }
    try {
      const r = await fetch('/api/campaigns/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, cultivo: 'soya', fecha_inicio: fmt(form.fechaSiembra), estado: 'activa', lotes: [], costos, rentabilidad: { rendimientoTonHa: zd.rendimiento || 2.2, precioTonUSD: 370 }, clima: { tempProm: zd.tempProm || 28, region: zd.region || '' } }) })
      if (!r.ok) throw new Error('Error al crear campaña')
      setShowForm(false)
      setForm({ nombre: '', zona: '', hectareas: '', tipoSuelo: 'Medio', fechaSiembra: '', semilla: 'TMG 7262 IPRO' })
      fetchC()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="text-center py-12"><div className="w-5 h-5 border-2 border-gray-300 border-t-[#008C45] rounded-full animate-spin mx-auto"></div></div>

  const totalHa = campaigns.reduce((a, c) => a + (c.hectareas || 0), 0)
  const totalIng = campaigns.reduce((a, c) => a + (c.rentabilidad ? c.rentabilidad.rendimientoTonHa * c.rentabilidad.precioTonUSD * (c.hectareas || 1) : 0), 0)

  return (
    <div>
      {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-[#1F2A24]">Campo</h1>
          <p className="text-sm text-gray-400 mt-1">Campa&ntilde;as y costos de soya</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="text-sm font-medium text-[#008C45] hover:text-[#064E2E] transition-colors">
          {showForm ? 'Cancelar' : '+ Nueva Campaña'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4"><p className="text-xs text-gray-400 uppercase">Campa&ntilde;as</p><p className="text-2xl font-bold text-[#1F2A24]">{campaigns.length}</p></div>
        <div className="bg-white border border-gray-200 rounded-lg p-4"><p className="text-xs text-gray-400 uppercase">Hect&aacute;reas</p><p className="text-2xl font-bold text-[#008C45]">{totalHa.toLocaleString()}</p></div>
        <div className="bg-white border border-gray-200 rounded-lg p-4"><p className="text-xs text-gray-400 uppercase">Ingreso Esperado</p><p className="text-2xl font-bold text-[#D6A03A]">${totalIng.toLocaleString()}</p></div>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-[#1F2A24] mb-3">Nueva Campa&ntilde;a</h3>
          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nombre</label>
              <input type="text" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#008C45] outline-none ${formErrors.nombre ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Ej: Soya Verano 2026" />
              {formErrors.nombre && <p className="text-xs text-red-500 mt-1">{formErrors.nombre}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Zona</label>
              <select value={form.zona} onChange={(e) => handleZona(e.target.value)} className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#008C45] outline-none ${formErrors.zona ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                <option value="">Seleccionar...</option>
                {Object.keys(ZONAS_DATA).map(z => <option key={z} value={z}>{z}</option>)}
              </select>
              {formErrors.zona && <p className="text-xs text-red-500 mt-1">{formErrors.zona}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Hect&aacute;reas</label>
              <input type="number" min="1" value={form.hectareas} onChange={(e) => setForm({...form, hectareas: e.target.value})} className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#008C45] outline-none ${formErrors.hectareas ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
              {formErrors.hectareas && <p className="text-xs text-red-500 mt-1">{formErrors.hectareas}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Suelo</label>
              <select value={form.tipoSuelo} onChange={(e) => setForm({...form, tipoSuelo: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#008C45] outline-none"><option>Bueno</option><option>Medio</option><option>Regular</option><option>Alto</option></select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Fecha Siembra</label>
              <input type="date" value={form.fechaSiembra} onChange={(e) => setForm({...form, fechaSiembra: e.target.value})} className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#008C45] outline-none ${formErrors.fechaSiembra ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
              {formErrors.fechaSiembra && <p className="text-xs text-red-500 mt-1">{formErrors.fechaSiembra}</p>}
              {form.fechaSiembra && <p className="text-[10px] text-gray-300 mt-0.5">{fmt(form.fechaSiembra)}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Variedad</label>
              <select value={form.semilla} onChange={(e) => setForm({...form, semilla: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#008C45] outline-none"><option>TMG 7262 IPRO</option><option>Don Mario 68i68</option><option>Nidera 6860</option></select>
            </div>
            {form.zona && ZONAS_DATA[form.zona] && (<div className="md:col-span-2 bg-[#008C45]/5 border border-[#008C45]/20 rounded-lg p-2.5 text-xs text-[#008C45]">Regi&oacute;n {ZONAS_DATA[form.zona].region} &middot; {ZONAS_DATA[form.zona].tempProm}&deg;C &middot; {ZONAS_DATA[form.zona].rendimiento} ton/ha</div>)}
            <div className="md:col-span-2"><button type="submit" className="bg-[#008C45] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#064E2E] transition-colors">Crear Campa&ntilde;a</button></div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {campaigns.map((c) => {
          const costo = c.costos ? Object.values(c.costos).reduce((s, v) => s + v, 0) : 0
          const ing = c.rentabilidad ? c.rentabilidad.rendimientoTonHa * c.rentabilidad.precioTonUSD * (c.hectareas || 1) : 0
          const gan = ing - (costo / 6.96)
          const isOpen = selected === c.id

          return (
            <div key={c.id} className={`bg-white border rounded-lg transition-colors ${isOpen ? 'border-[#008C45]' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="p-4 cursor-pointer" onClick={() => setSelected(isOpen ? null : c.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#008C45]/10 rounded-md flex items-center justify-center"><span className="text-[#008C45] text-xs font-bold">{c.hectareas || 0}</span></div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#1F2A24]">{c.nombre}</h4>
                      <p className="text-xs text-gray-400">{c.zona} &middot; {c.semilla || 'TMG 7262'} &middot; {c.fechaSiembra || ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#008C45]">${ing.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              {isOpen && (
                <div className="border-t border-gray-100 p-4 space-y-3">
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="bg-gray-50 rounded p-2"><p className="text-xs text-gray-400">Rend.</p><p className="text-sm font-bold text-[#1F2A24]">{c.rentabilidad?.rendimientoTonHa || 2.2} t/ha</p></div>
                    <div className="bg-gray-50 rounded p-2"><p className="text-xs text-gray-400">Precio</p><p className="text-sm font-bold text-[#1F2A24]">${c.rentabilidad?.precioTonUSD || 370}</p></div>
                    <div className="bg-gray-50 rounded p-2"><p className="text-xs text-gray-400">Costo</p><p className="text-sm font-bold text-[#1F2A24]">Bs {costo.toLocaleString()}</p></div>
                    <div className="bg-gray-50 rounded p-2"><p className="text-xs text-gray-400">Ganancia</p><p className={`text-sm font-bold ${gan > 0 ? 'text-[#008C45]' : 'text-red-500'}`}>${gan.toLocaleString(undefined, {maximumFractionDigits: 0})}</p></div>
                  </div>
                  {c.costos && (
                    <div className="grid grid-cols-7 gap-1.5 text-center">
                      {Object.entries(c.costos).map(([k, v]) => (
                        <div key={k} className="bg-gray-50 rounded p-1.5">
                          <p className="text-[10px] text-gray-400 capitalize">{k}</p>
                          <p className="text-[10px] font-bold text-[#1F2A24]">{(v / (c.hectareas || 1)).toFixed(0)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3 text-xs text-[#008C45]">
                    <span className="hover:underline cursor-pointer">Actividades</span>
                    <span className="hover:underline cursor-pointer">Bit&aacute;cora</span>
                    <span className="hover:underline cursor-pointer">Exportar</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {campaigns.length === 0 && !showForm && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-400 mb-3">Sin campa&ntilde;as</p>
          <button onClick={() => setShowForm(true)} className="text-xs text-[#008C45] hover:underline">Crear primera campa&ntilde;a</button>
        </div>
      )}
    </div>
  )
}

export default CampoDashboard