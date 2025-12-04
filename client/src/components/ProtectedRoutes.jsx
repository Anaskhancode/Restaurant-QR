import React from 'react'
import { Navigate} from 'react-router-dom';

function ProtectRoutes({ children }) {
    console.log(children)
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken)
    if (!accessToken) {
        return <Navigate to='/login' />
    }
    // if(accessToken){
    //     return <Navigate to='/'/>
    // }
    return (
        <div>
            {children}
        </div>
    )
}

export default ProtectRoutes