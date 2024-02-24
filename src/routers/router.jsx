import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import { Login } from '../Pages/Login'
import { Sales } from '../Pages/Sales'

export function Rotas() {

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route exact path='/sales' element={<Sales />} />
      </Routes>
    </BrowserRouter>
  )
}

