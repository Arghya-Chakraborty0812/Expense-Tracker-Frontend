import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents Default Form Submission
    const url = isLogin ? 'https://expense-tracker-backend-1-br47.onrender.com/login' : 'https://expense-tracker-backend-1-br47.onrender.com/signup';
    const payLoad = isLogin ? { username, password } : { email, username, password };
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payLoad), // Sending Form Data as JSON
      });
      const data = await res.json(); // Parse data from backend
      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert(data.message);
        navigate('/dashboard');
        if (!isLogin) { // If Signup
          setIsLogin(true);
          setEmail('');
          setPassword('');
          setUsername('');
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log('Error:', err);
      alert('Something Went Wrong');
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center"
      style={{
        background:
          'linear-gradient(to right, #A5B0FA 10%, #6674D5 37%, #374499 52%, #2B3DB2 67%, #0A1D98 83%)',
      }}
    >
      <div
        className="bg-white rounded-3xl p-8 shadow-2xl"
        style={{ height: 'auto', width: '40rem' }}
      >
        <div className="text-4xl font-bold text-center mb-8">
          {isLogin ? 'Login Form' : 'Signup Form'}
        </div>

        {/* Toggle buttons */}
        <div className="flex justify-center mb-10">
          <div className="flex rounded-full bg-gray-100 shadow-md overflow-hidden text-lg font-semibold">
            <button
              type="button"
              className={`py-3 px-10 transition-all duration-200 ${
                isLogin ? 'bg-[#3e5596] text-white shadow-lg' : 'text-black'
              }`}
              onClick={() => setIsLogin(true)}
            >
              LOGIN
            </button>
            <button
              type="button"
              className={`py-3 px-10 transition-all duration-200 ${
                !isLogin ? 'bg-[#3e5596] text-white shadow-lg' : 'text-black'
              }`}
              onClick={() => setIsLogin(false)}
            >
              SIGNUP
            </button>
          </div>
        </div>

        {/* Animated form */}
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              {/* Username for login */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder={isLogin ? 'Username' : 'Email Address'}
                  value={isLogin ? username : email}
                  onChange={(e) => (isLogin ? setUsername(e.target.value) : setEmail(e.target.value))}
                  className="w-full py-4 px-6 text-lg rounded-full border border-gray-300 shadow-md focus:outline-none"
                  required
                />
              </div>

              {/* Username (only for signup) */}
              {!isLogin && (
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full py-4 px-6 text-lg rounded-full border border-gray-300 shadow-md focus:outline-none"
                    required
                  />
                </div>
              )}

              {/* Password */}
              <div className="mb-6">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-4 px-6 text-lg rounded-full border border-gray-300 shadow-md focus:outline-none"
                  required
                />
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  className="w-full py-4 text-xl bg-[#3e5596] text-white font-bold rounded-full shadow-lg hover:opacity-90 transition cursor-pointer"
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
