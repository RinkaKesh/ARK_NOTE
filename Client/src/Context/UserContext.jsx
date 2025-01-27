import React, { createContext, useState,useEffect } from 'react'
import {getUserData,getToken,isAuth} from '../fun'
export const ProfileContext=createContext()

const UserContext = ({children}) => {
   
    const[profileData,setProfileData]=useState(null)
    const[isLoggedIn,setIsLoggedIn]=useState(false)
    

    useEffect(() => {
      const storedUserData=getUserData();
      const storedAuth=isAuth()
      setProfileData(storedUserData)
      setIsLoggedIn(storedAuth)
    }, []);
  

  return (
    <ProfileContext.Provider value={{profileData,setProfileData}}>
      {children}
    </ProfileContext.Provider>
  )
}

export default UserContext
