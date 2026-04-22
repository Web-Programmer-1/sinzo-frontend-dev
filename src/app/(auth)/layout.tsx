import React from 'react'

export default function AuthLayout({children}:{children:React.ReactNode}) {
  return (
    <div className='flex justify-center items-center min-h-[100vh]'>
      {children}
    </div>
  )
}
