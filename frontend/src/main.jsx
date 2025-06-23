import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "react-hot-toast"
import UserContext from './Context/userContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter forceRefresh={true}>
      <UserContext>
        <App />
        <Toaster />
      </UserContext>
    </BrowserRouter>
  </StrictMode>,
)
