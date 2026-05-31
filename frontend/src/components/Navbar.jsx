import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 flex items-center justify-center overflow-hidden rounded-full" style={{mixBlendMode: 'multiply'}}>
            <img src="/logo.png" alt="AgroSoya" className="h-10 w-10 object-cover" />
          </div>
          <span className="text-xl font-semibold text-[#1F2A24]">AgroSoya</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-gray-500 hover:text-[#1F2A24] transition-colors">Inicio</Link>
          <Link to="/campo" className="text-sm text-gray-500 hover:text-[#1F2A24] transition-colors">Campo</Link>
          <Link to="/acopio" className="text-sm text-gray-500 hover:text-[#1F2A24] transition-colors">Acopio</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar