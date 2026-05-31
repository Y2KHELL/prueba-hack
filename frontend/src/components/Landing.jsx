import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Landing() {
  const [clima, setClima] = useState([])
  const [regionFilter, setRegionFilter] = useState('Todas')
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null)
  const [noticias, setNoticias] = useState([])
  const [climaError, setClimaError] = useState(false)
  const [noticiasError, setNoticiasError] = useState(false)

  const fetchClima = () => {
    fetch('/api/climate/weather-all')
      .then(r => { if (!r.ok) throw new Error('Error al obtener clima'); return r.json() })
      .then(data => { setClima(data); setUltimaActualizacion(new Date()); setClimaError(false) })
      .catch(() => setClimaError(true))
  }

  useEffect(() => { fetchClima() }, [])
  useEffect(() => { const i = setInterval(fetchClima, 5 * 60 * 1000); return () => clearInterval(i) }, [])
  useEffect(() => {
    fetch('/api/news/')
      .then(r => { if (!r.ok) throw new Error('Error al obtener noticias'); return r.json() })
      .then(d => setNoticias(d.slice(0, 6)))
      .catch(() => setNoticiasError(true))
  }, [])

  const traducir = (c) => {
    if (!c) return '--'
    const l = c.toLowerCase()
    if (l.includes('clear') || l.includes('sunny')) return 'Despejado'
    if (l.includes('partly') || l.includes('partial')) return 'Parcial nublado'
    if (l.includes('cloudy') || l.includes('overcast')) return 'Nublado'
    if (l.includes('rain') || l.includes('drizzle')) return 'Lluvioso'
    if (l.includes('thunder')) return 'Tormenta'
    if (l.includes('fog') || l.includes('mist')) return 'Neblinoso'
    return c
  }

  const filtered = regionFilter === 'Todas' ? clima : clima.filter(c => c.region === regionFilter)

  const getAlerta = (c) => {
    const t = c.clima?.temperatura || 28
    const v = c.clima?.viento || 10
    const cond = (c.clima?.condicion || '').toLowerCase()
    if (cond.includes('rain') || cond.includes('thunder')) return { tipo: 'Lluvia', color: 'bg-blue-50 text-blue-600' }
    if (t > 33) return { tipo: 'Calor', color: 'bg-red-50 text-red-600' }
    if (v > 20) return { tipo: 'Viento', color: 'bg-orange-50 text-orange-600' }
    if (t < 18) return { tipo: 'Frio', color: 'bg-purple-50 text-purple-600' }
    return { tipo: 'OK', color: 'bg-[#008C45]/10 text-[#008C45]' }
  }

  const totalHa = filtered.reduce((a, z) => a + (z.hectareas || 0), 0)

  return (
    <div>
      <section className="relative h-[420px] bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&h=500&fit=crop')"}}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <p className="text-xs font-medium mb-3 tracking-widest uppercase text-gray-300">Santa Cruz, Bolivia</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 max-w-2xl leading-tight">Gesti&oacute;n Inteligente de Cultivos y Acopio de Soya</h1>
          <p className="text-base text-gray-300 mb-6 max-w-lg">Plataforma que conecta el campo con el acopio usando inteligencia artificial.</p>
          <Link to="/acopio" className="bg-white text-[#1F2A24] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">Empezar</Link>
        </div>
      </section>

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/campo" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#008C45] transition-colors group block">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-[#008C45]/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#008C45]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#1F2A24] group-hover:text-[#008C45] transition-colors">Modo Campo</h3>
                <p className="text-sm text-gray-400">Campa&ntilde;as, costos, actividades</p>
              </div>
            </div>
          </Link>
          <Link to="/acopio" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#D6A03A] transition-colors group block">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-[#D6A03A]/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#D6A03A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#1F2A24] group-hover:text-[#D6A03A] transition-colors">Modo Acopio</h3>
                <p className="text-sm text-gray-400">Recepci&oacute;n, an&aacute;lisis IA, calidad</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1F2A24]">Clima en Zonas de Producci&oacute;n</h2>
              <p className="text-sm text-gray-400 mt-1">{filtered.length} zonas &middot; {totalHa.toLocaleString()} ha{ultimaActualizacion && ` · ${ultimaActualizacion.toLocaleTimeString('es-BO')}`}</p>
            </div>
            <div className="flex gap-1.5">
              {['Todas', 'Este', 'Norte', 'Sur'].map(r => (
                <button key={r} onClick={() => setRegionFilter(r)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${regionFilter === r ? 'bg-[#008C45] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}>{r}</button>
              ))}
            </div>
          </div>

          {climaError ? (
            <div className="text-center py-8 text-gray-400 text-sm">No se pudo obtener el clima. Verifica tu conexi&oacute;n.</div>
          ) : clima.length === 0 ? (
            <div className="text-center py-8"><div className="w-5 h-5 border-2 border-gray-300 border-t-[#008C45] rounded-full animate-spin mx-auto"></div></div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {filtered.map((z) => {
                const a = getAlerta(z)
                return (
                  <div key={z.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-[#1F2A24]">{z.nombre}</h3>
                        <p className="text-xs text-gray-400">{z.region} &middot; {z.hectareas.toLocaleString()} ha &middot; {z.rendimiento} t/ha</p>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${a.color}`}>{a.tipo}</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                      <span className="text-2xl font-bold text-[#1F2A24]">{z.clima?.temperatura || '--'}&deg;</span>
                      <div className="text-xs text-gray-400 space-y-0.5">
                        <div>{z.clima?.humedad || '--'}% hum</div>
                        <div>{z.clima?.viento || '--'} km/h</div>
                        <div>{traducir(z.clima?.condicion)}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-[#1F2A24] mb-1">Noticias</h2>
        <p className="text-sm text-gray-400 mb-6">Santa Cruz, Bolivia</p>
        {noticiasError ? (
          <div className="text-center py-8 text-gray-400 text-sm">No se pudieron cargar las noticias.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {noticias.map(n => (
              <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors block group">
                <p className="text-[10px] text-[#008C45] font-bold uppercase mb-1.5">{n.fuente}</p>
                <h4 className="text-base font-medium text-[#1F2A24] mb-1.5 group-hover:text-[#008C45] transition-colors leading-snug">{n.titulo}</h4>
                <p className="text-xs text-gray-400 line-clamp-2 mb-2">{n.resumen}</p>
                <span className="text-xs text-gray-400">{n.fecha}</span>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Landing