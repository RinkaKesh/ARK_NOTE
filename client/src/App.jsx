import AllRoutes from "./AllRoutes/AllRoutes"
import { ToastContainer } from 'react-toastify'
import { Link, useNavigate } from "react-router-dom"
import './App.css'
import Navbar from "./Components/Navbar"

function App() {

 
 
  return (
    <div className="app w-[100vw] h-[100vh] overflow-y-auto m-0 p-0 flex">
      <Navbar/>
      <div className="flex-1 ml-[300px] h-[100vh] overflow-y-auto ">
      <AllRoutes />
      </div>
      <ToastContainer />
    </div>

  )
}

export default App
