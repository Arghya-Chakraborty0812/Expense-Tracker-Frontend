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
import Navbar from './Navbar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ExpenseBarChart() {
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('https://expense-tracker-backend-1-br47.onrender.com/expenses', {
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
    <Navbar/>
    <div className='w-[90%] md:w-[60%] mx-auto mt-10'>
      {chartData ? <Bar data={chartData} options={options} /> : <p>Loading chart...</p>}
    </div>
    </>
  );
}
