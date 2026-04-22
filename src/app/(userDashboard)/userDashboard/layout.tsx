import React from 'react'
import UserDashboard from '../../../components/_USERDASHBOARD/UserDashboard'

export default function UserDashboardLayout({children}:{
    children:React.ReactNode
}) {
  return (
    <div>
        <UserDashboard>
                {children}
        </UserDashboard>
  
    </div>
  )
}
