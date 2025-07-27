import { useState } from 'react'
import Landing from './components/Landing'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import ManageExpenses from './components/ManageExpenses'
import Charts from './components/Charts'
import { ToastContainer } from 'react-toastify'
function App() {
 

  return (
    <>
    <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    <BrowserRouter>
    <Routes>
    
      <Route path='/' element={<Landing/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/manageExpenses' element={<ManageExpenses/>}/>
      <Route path='/charts' element={<Charts/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
