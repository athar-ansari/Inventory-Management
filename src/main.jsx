import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css'

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
    />
  </StrictMode>
)