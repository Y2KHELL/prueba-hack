import { useState, useRef } from 'react'

const MuestraVisual = ({ intakeId, onComplete }) => {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [observaciones, setObservaciones] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const handleSubmit = () => {
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target.result
      await fetch('/api/samples/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingreso_id: intakeId, tipo_muestra: 'visual', imagen_url: base64, observaciones, fecha_evaluacion: new Date().toISOString() }),
      })
      onComplete?.(null, base64)
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-xl font-bold text-[#1F2A24] mb-1">Muestra Visual</h3>
      <p className="text-sm text-gray-500 mb-6">Sube una foto de la muestra de soya</p>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#008C45] transition-colors cursor-pointer" onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          {preview ? (
            <img src={preview} alt="Muestra" className="max-h-64 mx-auto rounded-lg" />
          ) : (
            <div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-sm text-gray-500">Arrastra una imagen o haz clic</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG</p>
            </div>
          )}
        </div>

        <div><label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label><textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#008C45] outline-none h-20" placeholder="Describe el estado visual..." /></div>

        <button onClick={handleSubmit} disabled={!file || uploading} className="w-full bg-[#D6A03A] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50">
          {uploading ? 'Enviando...' : 'Enviar a Analisis IA'}
        </button>
      </div>
    </div>
  )
}

export default MuestraVisual
