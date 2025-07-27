import React from 'react'
import image1 from '../assets/Images/images-3-removebg-preview.png'
import image2 from '../assets/Images/line-wallet-icon-desgin-on-white-background-free-vector-removebg-preview.png'
import { useNavigate } from 'react-router-dom'
export default function Landing() {
  const navigate = useNavigate();
  return (
  <div>
    <div className='font-bold text-3xl p-2 flex justify-center items-center h-20 bg-cyan-500 text-white text-shadow-black'>Expense Tracker</div>
      <div className='bg-gray-100 h-110'>
        <div className='font-stretch-extra-condensed text-4xl flex justify-center pt-35 '>Finance made simple, smart, and secure.</div>
        <div className='flex justify-center pt-2 font-light text-gray-500 font-stretch-extra-condensed text-2xl'>Your money. Your rules. Our tracker</div>
            <div className='flex justify-center pt-9'>
                <button className= 'bg-cyan-400 text-white w-50 h-14 rounded-4xl text-2xl font-bold cursor-pointer button' style={{ boxShadow: '0 0 4px rgba(0,0,8,0.60)' }} onClick={() => navigate('/signup')}>Sign up</button>
            </div>
    </div>
    <div className='flex justify-evenly'>
      <img src={image1} alt='image1' style={{height:'5rem', width:'5rem ', marginTop: '2.8rem'}}/>
      <img src={image2} alt='image2' style={{height: '10rem', width:'10rem'}}/>
    </div>
    <div className='flex justify-evenly'>
      <h2 className='font-extrabold text-2xl'>Analyze Your Expenses</h2>
      <h2 className='font-extrabold text-2xl'>Manage Your Budget</h2>
    </div>
  </div>
  )
}


// font-stretch-extra-condensed text-4xl flex justify-center pt-35 sm:text-4xl justify-center