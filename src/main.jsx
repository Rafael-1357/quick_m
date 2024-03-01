import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { Rotas } from '../src/routers/router'
import { Toaster } from "@/components/ui/toaster"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Rotas />
    <Toaster />
  </React.StrictMode>
)
