import React from 'react'
import Navbar from './Navbar'

const Layout = ({children}) => {
  return (
    <div className='flex w-[100vw] h-[100vh] overflow-hidden'>
        <Navbar/>
        <div className='ml-0 md:ml-[270px] flex-1 overflow-y-auto'>
            {children}
        </div>
      
    </div>
  )
}

export default Layout

