import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import UserContext from './Context/UserContext.jsx'
import AuthProvider from './Context/AuthProvider.jsx'
import {NotesProvider} from './Context/NotesProvider.jsx'
createRoot(document.getElementById('root')).render(

  <UserContext>
    <NotesProvider>
      <BrowserRouter>

        <App />

      </BrowserRouter>
    </NotesProvider>
  </UserContext>

  ,
)
