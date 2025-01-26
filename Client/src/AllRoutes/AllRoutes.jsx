import React,{useContext} from 'react'
import Home from '../Pages/Home'
import Register from '../Pages/Register'
import Login from '../Pages/Login'
import Notes from '../Pages/Notes'
import AddNote from '../Pages/AddNote'
import Profile from '../Pages/Profile'
import { Routes,Route,Navigate,useNavigate } from 'react-router-dom'
import { AuthContext } from "../Context/AuthProvider";
import { isAuth } from '../fun'


const AllRoutes = () => {
const navigate=useNavigate()
  const ProtectedRoute=({children})=>{
    console.log(isAuth());
    
   if (!isAuth()){
    setTimeout(()=>{
       navigate("/")
    })
   }
   return children
  }
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/profile/:id" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
      <Route path="/notes" element={<ProtectedRoute><Notes/></ProtectedRoute>}/>
      <Route path="/create_note" element={<ProtectedRoute><AddNote/></ProtectedRoute>}/>
      <Route path="/create_note/:id" element={<ProtectedRoute><AddNote/></ProtectedRoute>}/>
    </Routes>
  )
}

export default AllRoutes