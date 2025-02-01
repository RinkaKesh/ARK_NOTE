// import React, { createContext, useState,useEffect } from 'react'
// import {getUserData,getToken,isAuth} from '../fun'
// export const ProfileContext=createContext()

// const UserContext = ({children}) => {
   
//     const[profileData,setProfileData]=useState(null)
//     const[isLoggedIn,setIsLoggedIn]=useState(false)
    

//     useEffect(() => {
//       const storedUserData=getUserData();
//       const storedAuth=isAuth()
//       setProfileData(storedUserData)
//       setIsLoggedIn(storedAuth)
//     }, []);
  

//   return (
//     <ProfileContext.Provider value={{profileData,setProfileData}}>
//       {children}
//     </ProfileContext.Provider>
//   )
// }

// export default UserContext
import React, { createContext, useState, useEffect } from 'react'
import { getUserData, getToken, isAuth } from '../fun'

export const ProfileContext = createContext()

const UserContext = ({ children }) => {
  const [profileData, setProfileData] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  useEffect(() => {
    // Check auth status whenever localStorage changes
    const handleStorageChange = () => {
      const storedAuth = isAuth()
      setIsLoggedIn(storedAuth)
      if (!storedAuth) {
        setProfileData(null)
      } else {
        const storedUserData = getUserData()
        setProfileData(storedUserData)
      }
    }

    // Initial check
    handleStorageChange()
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <ProfileContext.Provider value={{ 
      profileData, 
      setProfileData,
      isLoggedIn,
      setIsLoggedIn 
    }}>
      {children}
    </ProfileContext.Provider>
  )
}

export default UserContext