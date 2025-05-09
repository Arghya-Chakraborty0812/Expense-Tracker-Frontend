// src/components/ExpenseBarChart.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ExpenseBarChart() {
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/expenses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const expenses = await response.json();

      // Helper function to extract "YYYY-MM" from date string
      const getMonth = (dateStr) => {
        const [year, month] = dateStr.split('-'); // "YYYY-MM-DD"
        return `${year}-${month}`;
      };

      // Aggregate amounts by month
      const monthTotals = {};
      expenses.forEach(expense => {
        const month = getMonth(expense.date);
        if (!monthTotals[month]) {
          monthTotals[month] = 0;
        }
        monthTotals[month] += expense.amount;
      });

      // Sort months
      const labels = Object.keys(monthTotals).sort();
      const data = labels.map(month => monthTotals[month]);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Monthly Expense',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    };

    fetchExpenses();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Total Expenses by Month',
      },
    },
  };

  return (
    <>
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
    <div className='w-[90%] md:w-[60%] mx-auto mt-10'>
      {chartData ? <Bar data={chartData} options={options} /> : <p>Loading chart...</p>}
    </div>
    </>
  );
}
