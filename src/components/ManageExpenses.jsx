import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function ManageExpenses() {
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newExpense = { date, category, description, amount };

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // Check if there's a token
    if (!token) {
      alert('Please log in first');
      return;
    }

    try {
      // Send POST request to the backend API
      const response = await fetch('https://expense-tracker-backend-1-br47.onrender.com/expenses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add token to Authorization header
        },
        body: JSON.stringify(newExpense),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear inputs
        setDate('');
        setCategory('');
        setDescription('');
        setAmount('');

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        alert(data.message || 'Error adding expense');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add expense');
    }
  };

  return (
    <div>
      <Navbar/>
      <main style={{ backgroundColor: '#dcdcdc', minHeight: '100vh' }} className='flex flex-col items-center pt-10'>
        <h2 className='text-4xl font-light mb-10'>Add Expense</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 w-[80%] md:w-[40%]'>
          <div className='flex flex-col'>
            <label className='mb-1 text-lg font-medium'>Date</label>
            <input type='date' value={date} onChange={e => setDate(e.target.value)} className='p-2 border rounded-md bg-white' />
          </div>

          <div className='flex flex-col'>
            <label className='mb-1 text-lg font-medium'>Category</label>
            <input type='text' value={category} onChange={e => setCategory(e.target.value)} placeholder='e.g. Food' className='p-2 border rounded-md bg-white' />
          </div>

          <div className='flex flex-col'>
            <label className='mb-1 text-lg font-medium'>Description</label>
            <input type='text' value={description} onChange={e => setDescription(e.target.value)} placeholder='e.g. Lunch' className='p-2 border rounded-md bg-white' />
          </div>

          <div className='flex flex-col'>
            <label className='mb-1 text-lg font-medium'>Amount</label>
            <input type='number' value={amount} onChange={e => setAmount(e.target.value)} placeholder='e.g. 250' className='p-2 border rounded-md bg-white' />
          </div>

          <button type='submit' className='bg-cyan-500 text-white py-2 px-4 mt-4 rounded-md hover:bg-cyan-600'>
            Add Expense
          </button>
        </form>
      </main>
    </div>
  );
}
