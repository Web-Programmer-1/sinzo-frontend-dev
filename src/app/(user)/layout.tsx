import React from 'react'
import Navbar from '../../components/_layout/Navbar'
import MobileNav from '../../components/_layout/MobileAppBar'

export default function UserLayout({children}:{children:React.ReactNode}) {
  return (
    <div className='lg:max-w-7xl md:max-w-4xl mx-auto '>
        <Navbar></Navbar>
        {children}
        
        <MobileNav></MobileNav>
      
    </div>
  )
}
