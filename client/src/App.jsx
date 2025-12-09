import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import Register from './pages/Register'
import Homepage from './pages/Homepage';
import ProtectRoutes from './components/ProtectedRoutes';
import OpenRoutes from './components/OpenRoutes';
import Welcome from './pages/Welcome';
import { ToastProvider } from './context/ToastContext';



const App = () => {
  return (
    <ToastProvider>


      <Router>
        <Routes>

          <Route element={<ProtectRoutes/>}>
            <Route path="/" element={<Homepage />} />
          </Route>

          <Route path='/welcome' element={
            <OpenRoutes>
              <Welcome />
            </OpenRoutes>
          } />


          <Route path='/login' element={
            <OpenRoutes>

              <Login />
            </OpenRoutes>
          } />
          <Route path='/register' element={
            <OpenRoutes>

              <Register />
            </OpenRoutes>
          } />


        </Routes>
      </Router>




    </ToastProvider>
  )
}

export default App