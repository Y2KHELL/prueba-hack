import { useState } from 'react'
import NuevoIngreso from '../components/NuevoIngreso'
import RecepcionTecnica from '../components/RecepcionTecnica'
import MuestraVisual from '../components/MuestraVisual'
import ResultadoIA from '../components/ResultadoIA'
import Castigo from '../components/Castigo'
import Reporte from '../components/Reporte'
import AcopioDashboard from '../components/AcopioDashboard'

const Acopio = () => {
  const [step, setStep] = useState('dashboard')
  const [currentIntake, setCurrentIntake] = useState(null)
  const [imageData, setImageData] = useState(null)
  const [iaResult, setIaResult] = useState(null)
  const [penaltyInfo, setPenaltyInfo] = useState(null)

  const steps = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'nuevo', label: '1. Nuevo Ingreso' },
    { id: 'recepcion', label: '2. Recepcion' },
    { id: 'muestra', label: '3. Muestra Visual' },
    { id: 'analisis', label: '4. Analisis IA' },
    { id: 'castigo', label: '5. Penalizacion' },
    { id: 'reporte', label: '6. Reporte' },
  ]

  const resetFlow = () => { setStep('dashboard'); setCurrentIntake(null); setImageData(null); setIaResult(null); setPenaltyInfo(null) }

  return (
    <div className="pt-20 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1F2A24] mb-2">Modo Acopio</h1>
        <p className="text-sm text-gray-500 mb-6">Recepcion, analisis IA y control de calidad</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {steps.map((s) => (
            <button key={s.id} onClick={() => setStep(s.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${step === s.id ? 'bg-[#008C45] text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="max-w-4xl">
          {step === 'dashboard' && <AcopioDashboard />}
          {step === 'nuevo' && <NuevoIngreso onCreated={(ingreso) => { setCurrentIntake(ingreso); setStep('recepcion') }} />}
          {step === 'recepcion' && <RecepcionTecnica intakeId={currentIntake?.id} onComplete={() => setStep('muestra')} />}
          {step === 'muestra' && <MuestraVisual intakeId={currentIntake?.id} onComplete={(sample, base64) => { setImageData(base64); setStep('analisis') }} />}
          {step === 'analisis' && <ResultadoIA imageData={imageData} cultivo="soya" onResult={(result) => { setIaResult(result); setStep('castigo') }} />}
          {step === 'castigo' && <Castigo calidad={iaResult?.calidad || 'regular'} defectos={iaResult?.defectos || []} cultivo="soya" onComplete={(penalty) => { setPenaltyInfo(penalty); setStep('reporte') }} />}
          {step === 'reporte' && <Reporte intake={currentIntake} iaResult={iaResult} penaltyInfo={penaltyInfo} />}
        </div>

        {step !== 'dashboard' && (
          <button onClick={resetFlow} className="mt-6 text-sm text-gray-500 hover:text-[#008C45] transition-colors">
            Volver al Dashboard
          </button>
        )}
      </div>
    </div>
  )
}

export default Acopio
