import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-cyan-500 px-4 py-3">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-white font-bold text-2xl sm:text-3xl">
          Expense Tracker
        </h1>

        {/* Hamburger Icon */}
        <div className="sm:hidden">
          <button
            className="text-white text-3xl focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex gap-6 text-white font-medium">
          <li className="cursor-pointer hover:text-cyan-900" onClick={() => navigate('/charts')}>
            Report and Analytics
          </li>
          <li className="cursor-pointer hover:text-cyan-900" onClick={() => navigate('/manageExpenses')}>
            Manage Expenses
          </li>
          <li className="cursor-pointer hover:text-cyan-900" onClick={() => navigate('/dashboard')}>
            Dashboard
          </li>
          <li className="cursor-pointer hover:text-red-500" onClick={() => {
            localStorage.removeItem('token');
            navigate('/signup');
          }}>
            Logout
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="sm:hidden flex flex-col gap-4 text-white font-medium mt-4 text-center">
          <li className="cursor-pointer hover:text-cyan-900" onClick={() => { setMenuOpen(false); navigate('/charts'); }}>
            Report and Analytics
          </li>
          <li className="cursor-pointer hover:text-cyan-900" onClick={() => { setMenuOpen(false); navigate('/manageExpenses'); }}>
            Manage Expenses
          </li>
          <li className="cursor-pointer hover:text-cyan-900" onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}>
            Dashboard
          </li>
          <li className="cursor-pointer hover:text-red-500" onClick={() => {
            localStorage.removeItem('token');
            setMenuOpen(false);
            navigate('/signup');
          }}>
            Logout
          </li>
        </ul>
      )}
    </nav>
  );
}
