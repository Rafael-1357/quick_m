import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { Rotas } from '../src/routers/router'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Rotas />
  </React.StrictMode>
)
