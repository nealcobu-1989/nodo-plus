import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './config/api' // Cargar configuración de API

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found!')
}

console.log('Initializing React app...')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
