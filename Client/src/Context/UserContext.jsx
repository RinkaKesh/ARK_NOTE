import React, { createContext, useState } from 'react'
import {getUsername} from '../fun'
export const ProfileContext=createContext()

const UserContext = ({children}) => {
   
    const[profileData,setProfileData]=useState(null)
    const[username,setUsername]=useState(getUsername())

  return (
    <ProfileContext.Provider value={{profileData,setProfileData,username,setUsername}}>
      {children}
    </ProfileContext.Provider>
  )
}

export default UserContext
