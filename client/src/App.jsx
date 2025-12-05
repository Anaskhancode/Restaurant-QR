import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './pages/Navbar'
import Homepage from './pages/Homepage';
import ProtectRoutes from './components/ProtectedRoutes';
import OpenRoutes from './components/OpenRoutes';
import Welcome from './pages/Welcome';




const App = () => {
  return (
    <>
    {/* <Navbar/> */}
    <Router>
      <Routes>

        <Route path='/'element={
          <ProtectRoutes>
            <Homepage/>
          </ProtectRoutes>
          }/>

          <Route path='/welcome' element={
            <OpenRoutes>
              <Welcome/>
            </OpenRoutes>
            }/>


        <Route path='/login'element={
          <OpenRoutes>

            <Login/>
          </OpenRoutes>
          }/>
        <Route path='/register'element={
          <OpenRoutes>

            <Register/>
          </OpenRoutes>
          }/>

          
      </Routes>
    </Router>
    
    
    
     
    </>
  )
}

export default App