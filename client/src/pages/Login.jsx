import React from 'react'
import { useState } from 'react';
import {useDispatch} from 'react-redux'
import { login } from '../redux/authSlice.js';

const Login = () => {
    const dispatch=useDispatch()
    const [data, setData] = useState({
        email: "",
        password: ''
    })

    const handleChange = (e)=>{
        setData({...data,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit=(e)=>{
        e.preventDefault()
        dispatch(login(data))
    }



    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="bg-black text-white shadow-lg rounded-2xl p-8 w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-1 font-medium text-white">Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            placeholder="Enter your email"
                            value={data.email}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>


                    <div>
                        <label className="block mb-1 font-medium text-white">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form >
            </div >
        </div >
    );
}

export default Login