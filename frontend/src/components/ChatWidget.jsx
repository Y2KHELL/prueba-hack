import { useState, useRef, useEffect } from 'react'

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hola! Soy AgroBot. Preguntame sobre soya, calidad, humedad o la plataforma.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const mockResponse = (text) => {
    const lower = text.toLowerCase()
    if (lower.includes('humedad')) return "La humedad maxima para soya es 14%. Cada punto extra genera un castigo del 2.5%. Te recomiendo usar el modo acopio para medirlo correctamente."
    if (lower.includes('calidad')) return "La calidad se clasifica en A (+90% sanos), B (80-90%), C (70-80%) y D (<70%). Se evalua porcentaje de granos sanos, partidos, manchados y con moho."
    if (lower.includes('castigo') || lower.includes('descuento')) return "El castigo se calcula por: humedad excedida (2.5% por punto), defectos graves (moho = 30pts) y defectos menores (partido = 10pts). Puede llegar al 30%."
    if (lower.includes('precio') || lower.includes('soya') || lower.includes('soja')) return "Precio actual: $370 USD/tonelada (~Bs 2,590). Rendimiento promedio en Santa Cruz: 2.0-2.5 ton/ha. Siembra en verano (nov-dic) o invierno (jun-jul)."
    if (lower.includes('campo')) return "En Modo Campo podes crear campanas, registrar costos (semilla, fertilizante, etc.), actividades y ver rentabilidad esperada."
    if (lower.includes('acopio')) return "En Modo Acopio: registras ingreso del camion, pones humedad medida, subes fotos y la IA analiza calidad automaticamente."
    if (lower.includes('hola') || lower.includes('buenas') || lower.includes('que tal')) return "Hola! Soy el asistente de AgroSoya. Preguntame sobre soya, calidad de grano, humedad o como usar la plataforma."
    return "Preguntame sobre: humedad, calidad, castigos, modo campo, modo acopio, precios de soya o como usar AgroSoya."
  }

  const send = async () => {
    if (!input.trim() || loading) return
    const msg = input.trim()
    setMessages(p => [...p, { role: 'user', text: msg }])
    setInput('')
    setLoading(true)
    try {
      const r = await fetch('/api/chat/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg }) })
      if (!r.ok) throw new Error('Error')
      const d = await r.json()
      setMessages(p => [...p, { role: 'bot', text: d.response || 'No pude procesar.' }])
    } catch { setMessages(p => [...p, { role: 'bot', text: mockResponse(msg) }]) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="mb-3 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-[#008C45] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/40 flex-shrink-0 bg-white">
                <img src="/mascota.jpeg" alt="" className="w-full h-full object-cover" style={{mixBlendMode: 'multiply'}} />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">AgroBot</h4>
                <p className="text-white/60 text-xs">IA · Gemini</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>

          <div className="h-80 overflow-y-auto p-3 space-y-3 bg-white">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'bot' && (
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mr-1.5 mt-0.5 bg-white border border-gray-100">
                    <img src="/mascota.jpeg" alt="" className="w-full h-full object-cover" style={{mixBlendMode: 'multiply'}} />
                  </div>
                )}
                <div className={`max-w-[78%] px-4 py-2 rounded-xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-[#008C45] text-white rounded-br-sm' : 'bg-gray-50 text-[#1F2A24] border border-gray-100 rounded-bl-sm'}`}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mr-1.5 mt-0.5 bg-white border border-gray-100">
                  <img src="/mascota.jpeg" alt="" className="w-full h-full object-cover" style={{mixBlendMode: 'multiply'}} />
                </div>
                <div className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl rounded-bl-sm">
                  <div className="flex gap-0.5"><div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{animationDelay:'0.1s'}}></div><div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div></div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="p-2.5 border-t border-gray-100 bg-white">
            <div className="flex gap-1.5">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())} placeholder="Escribi..." className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#008C45]" />
              <button onClick={send} disabled={!input.trim() || loading} className="w-8 h-8 bg-[#008C45] text-white rounded-lg flex items-center justify-center hover:bg-[#064E2E] transition-colors disabled:opacity-40"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg></button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="w-12 h-12 rounded-full shadow-lg overflow-hidden hover:scale-105 transition-transform border-2 border-white bg-white">
        <img src="/mascota.jpeg" alt="Chat" className="w-full h-full object-cover" style={{mixBlendMode: 'multiply'}} />
      </button>
    </div>
  )
}

export default ChatWidget