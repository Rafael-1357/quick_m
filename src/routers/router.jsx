import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from '@/Login'
import { Sales } from '@/Pages/Sales'
import { PreSale } from "@/Pages/PreSale";

export function Rotas() {

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route exact path='/presale' element={<PreSale />} />
        <Route exact path='/sales' element={<Sales />} />
      </Routes>
    </BrowserRouter>
  )
}

