import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ReactDom from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import {Provider} from 'react-redux'
// import store from './store/store.js'
import store from './store/store.ts'
import { Printer } from 'lucide-react'


createRoot(document.getElementById('root')!).render(
  // <Provider store={store}>
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  </Provider>
)
