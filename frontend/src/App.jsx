import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import ChatWidget from './components/ChatWidget'
import Home from './pages/Home'
import Campo from './pages/Campo'
import Acopio from './pages/Acopio'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/campo" element={<Campo />} />
            <Route path="/acopio" element={<Acopio />} />
          </Routes>
          <ChatWidget />
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App