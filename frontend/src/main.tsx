import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ReactDom from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'



createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
