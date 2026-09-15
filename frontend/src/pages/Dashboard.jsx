import React, { useState, useEffect, useContext } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [viewType, setViewType] = useState('chart');
  const [timeFilter, setTimeFilter] = useState('all');
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expensesRes, categoriesRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/categories')
      ]);
      setExpenses(expensesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setIsEditing(true);
      setCurrentExpenseId(expense.id);
      setFormData({
        description: expense.description,
        amount: expense.amount,
        category_id: expense.category_id,
        date: expense.date,
      });
    } else {
      setIsEditing(false);
      setCurrentExpenseId(null);
      setFormData({
        description: '',
        amount: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await api.put(`/expenses/${currentExpenseId}`, formData);
        setExpenses(expenses.map(exp => exp.id === currentExpenseId ? res.data : exp));
      } else {
        const res = await api.post('/expenses', formData);
        setExpenses([res.data, ...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save expense', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        setExpenses(expenses.filter(exp => exp.id !== id));
      } catch (error) {
        console.error('Failed to delete expense', error);
      }
    }
  };

  // Calculations
  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  
  const categoryTotals = expenses.reduce((acc, exp) => {
    const catName = exp.category?.name || 'Unknown';
    acc[catName] = (acc[catName] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});
  
  let largestCategory = 'None';
  let maxCatTotal = 0;
  Object.keys(categoryTotals).forEach(cat => {
    if (categoryTotals[cat] > maxCatTotal) {
      maxCatTotal = categoryTotals[cat];
      largestCategory = cat;
    }
  });

  const remainingBudget = 3000 - totalExpenses; // Fixed budget of 3000 for now

  // Chart Data Preparation
  const processChartData = () => {
    let filteredExpenses = [...expenses];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    if (timeFilter === 'month') {
      filteredExpenses = filteredExpenses.filter(exp => {
        const d = new Date(exp.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
    } else if (timeFilter === 'year') {
      filteredExpenses = filteredExpenses.filter(exp => {
        const d = new Date(exp.date);
        return d.getFullYear() === currentYear;
      });
    }

    const aggregated = filteredExpenses.reduce((acc, exp) => {
      let key;
      const d = new Date(exp.date);
      
      if (timeFilter === 'month') {
        key = d.getDate().toString();
      } else if (timeFilter === 'year') {
        key = d.toLocaleDateString('en-US', { month: 'short' });
      } else {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      }

      acc[key] = (acc[key] || 0) + parseFloat(exp.amount);
      return acc;
    }, {});

    let sortedKeys;
    if (timeFilter === 'month') {
      sortedKeys = Object.keys(aggregated).sort((a, b) => parseInt(a) - parseInt(b));
    } else if (timeFilter === 'year') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      sortedKeys = Object.keys(aggregated).sort((a, b) => months.indexOf(a) - months.indexOf(b));
    } else {
      sortedKeys = Object.keys(aggregated).sort();
    }

    return sortedKeys.map(key => ({
      name: key,
      amount: aggregated[key]
    }));
  };

  const chartData = processChartData();

  return (
    <div className="min-h-screen p-8 font-sans text-gray-800 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 flex justify-between items-start sm:items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Expense Tracker Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}!</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold hover:bg-indigo-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              title="Profile"
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 animate-fade-in-up">
                <div className="p-4 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={logout}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
          {/* Summary Cards */}
          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100 transform transition-transform hover:scale-105 flex flex-col justify-center">
            <h3 className="text-[10px] sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2 truncate" title="Total Expenses">Total</h3>
            <p className="text-sm sm:text-3xl font-bold text-gray-900 truncate" title={`RM ${totalExpenses.toFixed(2)}`}>RM {totalExpenses.toFixed(2)}</p>
          </div>
          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100 transform transition-transform hover:scale-105 flex flex-col justify-center">
            <h3 className="text-[10px] sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2 truncate" title="Largest Category">Largest</h3>
            <p className="text-sm sm:text-3xl font-bold text-gray-900 truncate" title={largestCategory}>{largestCategory}</p>
          </div>
          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100 transform transition-transform hover:scale-105 flex flex-col justify-center">
            <h3 className="text-[10px] sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2 truncate" title="Remaining Budget (RM 3000)">Budget</h3>
            <p className={`text-sm sm:text-3xl font-bold truncate ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`} title={`RM ${remainingBudget.toFixed(2)}`}>
              RM {remainingBudget.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-col">
          {/* Chart Section */}
          <div className="order-2 lg:order-1 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <h3 className="text-base sm:text-lg font-semibold">Expenses Over Time</h3>
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <select 
                  value={timeFilter} 
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-white border-none rounded-md text-xs sm:text-sm font-medium py-1.5 px-2 focus:ring-0 shadow-sm cursor-pointer outline-none"
                >
                  <option value="all">All Time</option>
                  <option value="year">This Year</option>
                  <option value="month">This Month</option>
                </select>
                <div className="flex items-center bg-white rounded-md p-1 shadow-sm">
                  <button 
                    onClick={() => setViewType('chart')}
                    className={`p-1 rounded ${viewType === 'chart' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                    title="Chart View"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                  </button>
                  <button 
                    onClick={() => setViewType('list')}
                    className={`p-1 rounded ${viewType === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                    title="List View"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-h-[200px] sm:min-h-[250px]">
              {chartData.length > 0 ? (
                viewType === 'chart' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(value) => `RM ${value}`} />
                      <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        formatter={(value) => [`RM ${value.toFixed(2)}`, 'Total']}
                      />
                      <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5'}} activeDot={{r: 6}} animationDuration={1000} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="overflow-y-auto max-h-[250px] pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                    <table className="w-full text-left text-sm text-gray-500">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 rounded-tl-lg">Period</th>
                          <th className="px-4 py-3 rounded-tr-lg text-right">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chartData.map((data, index) => (
                          <tr key={index} className="bg-white border-b last:border-0 hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{data.name}</td>
                            <td className="px-4 py-3 text-right font-bold text-gray-900">RM {data.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  No data to display yet. Add some expenses!
                </div>
              )}
            </div>
          </div>

          {/* Recent Expenses List */}
          <div className="order-1 lg:order-2 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col max-h-[300px] sm:max-h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Expenses</h3>
              <button 
                onClick={() => handleOpenModal()}
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
                title="Add New Expense"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-gray-200">
              {expenses.length === 0 && (
                <p className="text-gray-500 text-center py-4">No expenses yet.</p>
              )}
              {expenses.map((expense) => (
                <div key={expense.id} className="flex flex-col p-3 border border-gray-100 hover:border-indigo-100 hover:shadow-sm rounded-lg transition-all group bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{expense.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span 
                          className="inline-block w-2 h-2 rounded-full" 
                          style={{ backgroundColor: expense.category?.color || '#ccc' }}
                        ></span>
                        <p className="text-xs font-medium text-gray-500">{expense.category?.name}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">{expense.date}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">RM {parseFloat(expense.amount).toFixed(2)}</span>
                  </div>
                  
                  {/* Action Buttons (visible on hover) */}
                  <div className="flex justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(expense)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
                    <button onClick={() => handleDelete(expense.id)} className="text-xs text-red-600 hover:text-red-800 font-medium">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
          <div className="relative bg-white rounded-xl shadow-xl p-8 w-full max-w-md animate-fade-in-up">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {isEditing ? 'Edit Expense' : 'Add New Expense'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name / Description</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g., Grocery shopping"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (RM)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors"
                >
                  {isEditing ? 'Save Changes' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
