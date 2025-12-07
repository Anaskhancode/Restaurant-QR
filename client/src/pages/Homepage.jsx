import React from 'react'
import Navbar from './Navbar'
import { useEffect } from 'react'
import axios from 'axios'

const Homepage = () => {
  useEffect(()=>{
    axios.get('http://localhost:3000/menu',{
      headers:{
        Authorization:`Bearer ${localStorage.getItem('accessToken')}`,
      }
    })
  },[])
  return (
    <>
    <Navbar/>
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6">
       <h1 className='text-3xl font-extrabold text-center tracking-wide text-yellow-400 drop-shadow-lg'> Homepage </h1></div>
    </>
  )
}

export default Homepage