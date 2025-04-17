import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
  });
  const [budget, setBudget] = useState(1000);
  const categories = ['Groceries', 'Utilities', 'Entertainment', 'Transport', 'Other'];

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/expenses');
        setExpenses(response.data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
      }
    };
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/expenses', formData);
      setExpenses([...expenses, response.data]);
      setFormData({ description: '', amount: '', category: '' });
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const handleBudgetChange = (e) => {
    setBudget(Number(e.target.value));
  };

  const getCategoryTotals = () => {
    const totals = {};
    expenses.forEach((expense) => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    });
    return totals;
  };

  const categoryTotals = getCategoryTotals();
  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {position: 'top'},
      tooltip: {calllbacks: {label: (context) => `${context.label}: $${context.raw}`}},
    },
  };


  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>
        Personal Finance Tracker
      </h1>

      <div className='mb-6 bg-white p-4 rounded-lg shadow-lg max-w-2xl mx-auto'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Monthly Budget ($)
        </label>
        <input
          type='number'
          value={budget}
          onChange={handleBudgetChange}
          className='mt-1 p-2 w-full border rounded-md'
          min='0'
        />
        <p className='mt-2 text-sm text-gray-600'>
          Remaining: ${budget - expenses.reduce((sum, exp) => sum + exp.amount, 0)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className='mb-6 bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Description</label>
            <input 
              type='text'
              name='description'
              value={formData.description}
              onChange={handleChange}
              required
              className='mt-1 p-2 w-full border rounded-md'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Amount</label>
            <input 
              type='number'
              name='amount'
              value={formData.amount}
              onChange={handleChange}
              required
              className='mt-1 p-2 w-full border rounded-md'
              min='0'
            />
          </div>
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
            <select
              name='category'
              value={formData.category}
              onChange={handleChange}
              className='mt-1 p-2 w-full border rounded-md'
              required
            >
              <option value=''>Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type='submit'
          className='mt-4 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700'
        >
          Add Expense
        </button>
      </form>

      <div className='mb-6 bg-white p-6 rounded-lg max-w-2xl mx-auto'>
        <h2 className='text-xl font-bold mb-4 text-gray-800'>Expenses</h2>
        {expenses.length === 0 ? (
          <p className='text-gray-600'>No expenses yet.</p>
        ) : (
          <ul>
            {expenses.map((expense) => (
              <li key={expense._id}
                className='flex justify-between items-center py-2 border-b'
              >
                <span>
                  {expense.description} (${expense.amount}) - {expense.category}
                </span>
                <span className='text-gray-500'>
                  {new Date(expense.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='mb-6 bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto'>
        <h2 className='text-xl font-bold mb-4 text-gray-800'>Spending by Category</h2>
        {Object.keys(categoryTotals).length > 0 ? (
          <div className='h-80'>
            <Pie data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p className='text-gray-600'> No data to display yet.</p>
        )}
      </div>
    </div>
  )
}

export default App;

// Note: Make sure to run the backend server on port 5000 and have the necessary API endpoints set up.
// Also, ensure that you have the required packages installed: