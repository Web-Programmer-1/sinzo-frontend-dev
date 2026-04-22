import React from 'react'
import Navbar from '../../components/_layout/Navbar'
import Footer from '../../components/_layout/Footer'
import MobileNav from '../../components/_layout/MobileAppBar'
import SinzoFloatingContact from '../../components/floatContact/SinzoFloatingContact';


export default function UserLayout({children}:{children:React.ReactNode}) {
  return (
    <div className='lg:max-w-7xl md:max-w-4xl mx-auto '>
        <SinzoFloatingContact></SinzoFloatingContact>
        <Navbar></Navbar>
        {children}
        
        <Footer></Footer>
        <MobileNav></MobileNav>
      
    </div>
  )
}
