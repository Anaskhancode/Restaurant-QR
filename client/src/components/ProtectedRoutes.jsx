import React from 'react'
import { Navigate, Outlet} from 'react-router-dom';
import AuthenticatedLayout from './AuthenticatedLayout';

function ProtectRoutes() {      //{ children }
    // console.log(children)
    const accessToken = localStorage.getItem('accessToken');
    const sessionToken=localStorage.getItem('sessionToken')
    console.log(accessToken)
    if (!accessToken && !sessionToken) {
    return <Navigate to='/welcome' />
}
    // if(accessToken){
    //     return <Navigate to='/'/>
    // }
    return (
        
        <AuthenticatedLayout>
        {/* {children} */}
        <Outlet/>
        </AuthenticatedLayout>
        
    )
}

export default ProtectRoutes