import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const expensesPerPage = 5;

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
          toast.error(data.message || 'Failed to fetch expenses');
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

  // Pagination logic
  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = expenses.slice(indexOfFirstExpense, indexOfLastExpense);
  const totalPages = Math.ceil(expenses.length / expensesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navbar />
      <main className="bg-gray-200 min-h-screen pb-12">
        <h2 className="text-center pt-8 text-3xl sm:text-4xl font-light">Expenses</h2>
        <div className="overflow-x-auto mt-8 px-4">
          <table className="w-full bg-white rounded-md shadow-md min-w-[600px]">
            <thead className="bg-cyan-100 text-gray-800">
              <tr>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentExpenses.length > 0 ? (
                currentExpenses.map((expense) => (
                  <tr key={expense._id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{expense.date}</td>
                    <td className="py-2 px-4">{expense.category}</td>
                    <td className="py-2 px-4">{expense.description}</td>
                    <td className="py-2 px-4">₹{expense.amount}</td>
                    <td className="py-2 px-4">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDelete(expense._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No expenses added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {expenses.length > expensesPerPage && (
            <div className="flex justify-center mt-6 gap-2 flex-wrap">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-cyan-600 text-white rounded disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-cyan-800 text-white' : 'bg-white text-cyan-800 border'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-cyan-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
