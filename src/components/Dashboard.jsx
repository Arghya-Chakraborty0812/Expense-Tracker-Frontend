import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('https://expense-tracker-backend-1-br47.onrender.com/expenses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setExpenses(data);
        } else {
          alert(data.message || 'Failed to fetch expenses');
        }
      } catch (err) {
        console.error('Error fetching expenses:', err);
        alert('Error fetching expenses');
      }
    };

    fetchExpenses();
  }, [navigate]);

  const handleDelete = async (idToDelete) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://expense-tracker-backend-1-br47.onrender.com/expenses/${idToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setExpenses(expenses.filter(expense => expense._id !== idToDelete));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete expense');
      }
    } catch (err) {
      console.error('Error deleting expense:', err);
      alert('Error deleting expense');
    }
  };

  return (
    <div>
      <nav className='h-20 bg-cyan-500 flex justify-between items-center px-6'>
        <h1 className='font-bold text-white text-3xl'>Expense Tracker</h1>
        <ul className='flex gap-6 text-white font-medium'>
          <li className='cursor-pointer hover:text-cyan-900' onClick={() => navigate('/charts')}>Report and Analytics</li>
          <li onClick={() => navigate('/manageExpenses')} className='cursor-pointer hover:text-cyan-900'>Manage Expenses</li>
          <li className='cursor-pointer hover:text-cyan-900'>Manage Budget</li>
          <button onClick={() => { localStorage.removeItem('token'); navigate('/signup'); }}>
            <li className='cursor-pointer hover:text-red-500'>Logout</li>
          </button>
        </ul>
      </nav>

      <main style={{ backgroundColor: '#dcdcdc', minHeight: '100vh' }}>
        <h2 className='text-center pt-6 text-4xl font-thin'>Expenses</h2>
        <div className='overflow-x-auto mt-8 px-6'>
          <table className='w-full bg-white rounded-md shadow-md'>
            <thead className='bg-cyan-100'>
              <tr className='text-left'>
                <th className='py-2 px-4'>Date</th>
                <th className='py-2 px-4'>Category</th>
                <th className='py-2 px-4'>Description</th>
                <th className='py-2 px-4'>Amount</th>
                <th className='py-2 px-4'>Delete</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id} className='border-t'>
                  <td className='py-2 px-4'>{expense.date}</td>
                  <td className='py-2 px-4'>{expense.category}</td>
                  <td className='py-2 px-4'>{expense.description}</td>
                  <td className='py-2 px-4'>₹{expense.amount}</td>
                  <td className='py-2 px-4'>
                    <button
                      className='text-red-500 cursor-pointer hover:underline'
                      onClick={() => handleDelete(expense._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="5" className='text-center py-4 text-gray-500'>No expenses added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
