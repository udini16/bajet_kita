import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import BottomNav from '../components/layout/BottomNav';
import Sidebar from '../components/layout/Sidebar';
import HomeTab from '../components/tabs/HomeTab';
import ChartTab from '../components/tabs/ChartTab';
import PlanTab from '../components/tabs/PlanTab';
import SettingsTab from '../components/tabs/SettingsTab';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Navigation State
  const [currentTab, setCurrentTab] = useState('home');
  
  // Chart/Filter States
  const [viewType, setViewType] = useState('chart');
  const [timeFilter, setTimeFilter] = useState('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data);
    } catch (error) {
      console.error('Failed to fetch expenses', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setIsEditing(true);
      setCurrentExpenseId(expense.id);
      setFormData({
        description: expense.description,
        amount: expense.amount,
        category_id: expense.category_id,
        date: expense.date
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

  // Data Aggregations for HomeTab
  const totalExpenses = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const categoryTotals = expenses.reduce((acc, curr) => {
    const catName = curr.category?.name || 'Uncategorized';
    acc[catName] = (acc[catName] || 0) + parseFloat(curr.amount);
    return acc;
  }, {});
  let largestCategory = 'None';
  let maxCatAmount = 0;
  for (const [cat, amt] of Object.entries(categoryTotals)) {
    if (amt > maxCatAmount) {
      maxCatAmount = amt;
      largestCategory = cat;
    }
  }
  const remainingBudget = 3000 - totalExpenses; // Fixed budget for now

  // Data Aggregation for ChartTab
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

  // Render the current tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeTab 
            totalExpenses={totalExpenses}
            largestCategory={largestCategory}
            remainingBudget={remainingBudget}
            expenses={expenses}
            handleOpenModal={handleOpenModal}
            handleDelete={handleDelete}
          />
        );
      case 'chart':
        return (
          <ChartTab 
            chartData={chartData}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            viewType={viewType}
            setViewType={setViewType}
          />
        );
      case 'plan':
        return <PlanTab />;
      case 'settings':
        return <SettingsTab user={user} logout={logout} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-800">
      {/* Desktop Sidebar */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-full w-full max-w-full">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-100 p-4 sticky top-0 z-10 flex justify-between items-center shadow-sm shrink-0">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Expensify</h1>
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex bg-white border-b border-gray-100 p-6 justify-between items-center shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{currentTab}</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}!</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add Expense
          </button>
        </header>

        {/* Tab Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 lg:pb-6 relative z-0">
          <div className="max-w-5xl mx-auto w-full">
            {renderTabContent()}
          </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} handleOpenModal={handleOpenModal} />
      </div>

      {/* Add/Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Expense' : 'Add New Expense'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input type="text" name="description" value={formData.description} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white" placeholder="e.g. Morning Coffee" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (RM)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">RM</span>
                    <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleInputChange} required className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white" placeholder="0.00" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select name="category_id" value={formData.category_id} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white cursor-pointer">
                      <option value="" disabled>Select</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white cursor-pointer" />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">{isEditing ? 'Save Changes' : 'Add Expense'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
