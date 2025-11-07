import './App.css'
import { Route, Routes } from 'react-router-dom'
import Cartify from './pages/Cartify'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Cartify />}/>
    </Routes>
  )
}

export default App
