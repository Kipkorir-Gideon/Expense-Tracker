import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { AuthContext } from "./context/AuthContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const { user, token, login, signup, logout } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
  });
  const [budget, setBudget] = useState(1000);
  const categories = ["Groceries", "Utilities", "Entertainment", "Transport", "Other"];

  useEffect(() => {
    if (token) {
      const fetchExpenses = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/expenses");
          setExpenses(response.data);
        } catch (err) {
          console.error("Error fetching expenses:", err);
        }
      };
      fetchExpenses();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/expenses", formData);
      setExpenses([...expenses, response.data]);
      setFormData({ description: "", amount: "", category: "" });
    } catch (err) {
      console.error("Error adding expense:", err);
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
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" }, tooltip: { callbacks: { label: (context) => `${context.label}: $${context.raw}` } } },
  };

  const Login = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const handleLoginChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });
    const handleLoginSubmit = (e) => {
      e.preventDefault();
      login(credentials.username, credentials.password);
    };
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <form onSubmit={handleLoginSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Log In</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" name="username" value={credentials.username} onChange={handleLoginChange} className="mt-1 p-2 w-full border rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" value={credentials.password} onChange={handleLoginChange} className="mt-1 p-2 w-full border rounded-md" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">Log In</button>
        </form>
      </div>
    );
  };

  const Signup = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const handleSignupChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });
    const handleSignupSubmit = (e) => {
      e.preventDefault();
      signup(credentials.username, credentials.password);
    };
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <form onSubmit={handleSignupSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" name="username" value={credentials.username} onChange={handleSignupChange} className="mt-1 p-2 w-full border rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" value={credentials.password} onChange={handleSignupChange} className="mt-1 p-2 w-full border rounded-md" required />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700">Sign Up</button>
        </form>
      </div>
    );
  };

  const MainApp = () => (
    <>
      <div className="mb-6 text-right">
        <button onClick={logout} className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700">Log Out</button>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Personal Finance Tracker</h1>
      <div className="mb-6 bg-white p-4 rounded-lg shadow-lg max-w-2xl mx-auto">
        <label className="block text-sm font-medium text-gray-700">Monthly Budget ($)</label>
        <input type="number" value={budget} onChange={handleBudgetChange} className="mt-1 p-2 w-full border rounded-md" min="0" />
        <p className="mt-2 text-sm text-gray-600">
          Remaining: $
          {budget - expenses.reduce((sum, exp) => sum + exp.amount, 0)}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" min="0" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" required>
              <option value="">Select a category</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" className="mt-4 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">Add Expense</button>
      </form>
      <div className="mb-6 bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Expenses</h2>
        {expenses.length === 0 ? (
          <p className="text-gray-600">No expenses yet.</p>
        ) : (
          <ul>
            {expenses.map((expense) => (
              <li key={expense._id} className="flex justify-between items-center py-2 border-b">
                <span>{expense.description} (${expense.amount}) - {expense.category}</span>
                <span className="text-gray-500">{new Date(expense.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-6 bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Spending by Category</h2>
        {Object.keys(categoryTotals).length > 0 ? (
          <div className="h-80">
            <Pie data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p className="text-gray-600">No data to display yet.</p>
        )}
      </div>
    </>
  );

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;