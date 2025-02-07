import React from 'react'
import { MdDoubleArrow } from "react-icons/md";

const Header = ({header_text}) => {
  return (
    <div className=' w-full h-[88px] gap-2 bg-gray-50 text-gray-500 text-2xl flex justify-start items-center p-4'>
      <MdDoubleArrow size={32} className='text-amber-500' />
      {header_text}
    </div>
  )
}

export default Header
