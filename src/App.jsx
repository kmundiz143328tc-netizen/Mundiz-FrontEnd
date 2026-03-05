import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './assets/components/Login.jsx'
import Register from './assets/components/Register.jsx'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  )
}