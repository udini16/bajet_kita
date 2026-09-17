import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import BottomNav from '../components/layout/BottomNav';
import Sidebar from '../components/layout/Sidebar';
import LogoDoodle from '../components/layout/LogoDoodle';
import HomeTab from '../components/tabs/HomeTab';
import ChartTab from '../components/tabs/ChartTab';
import PlanTab from '../components/tabs/PlanTab';
import SettingsTab from '../components/tabs/SettingsTab';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [savingPlans, setSavingPlans] = useState([]);
  
  // Navigation State
  const [currentTab, setCurrentTab] = useState('home');
  
  // Chart/Filter States
  const [viewType, setViewType] = useState('chart');
  const [timeFilter, setTimeFilter] = useState('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);
  const [transactionType, setTransactionType] = useState('expense');
  
  // Form State
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchExpenses();
    fetchIncomes();
    fetchCategories();
    fetchSavingPlans();
  }, []);

  const fetchSavingPlans = async () => {
    try {
      const res = await api.get('/saving_plans');
      setSavingPlans(res.data);
    } catch (error) {
      console.error('Failed to fetch saving plans', error);
    }
  };

  const fetchIncomes = async () => {
    try {
      const res = await api.get('/incomes');
      setIncomes(res.data);
    } catch (error) {
      console.error('Failed to fetch incomes', error);
    }
  };

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

  const handleOpenModal = (item = null, type = 'expense') => {
    setTransactionType(type);
    
    // Filter categories based on selected type
    const availableCategories = categories.filter(c => c.type === type);
    
    if (item) {
      setIsEditing(true);
      setCurrentExpenseId(item.id);
      setFormData({
        description: item.description,
        amount: item.amount,
        category_id: item.category_id,
        date: item.date
      });
    } else {
      setIsEditing(false);
      setCurrentExpenseId(null);
      setFormData({
        description: '',
        amount: '',
        category_id: availableCategories.length > 0 ? availableCategories[0].id : '',
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
    const endpoint = transactionType === 'income' ? '/incomes' : '/expenses';
    const stateUpdater = transactionType === 'income' ? setIncomes : setExpenses;
    const currentState = transactionType === 'income' ? incomes : expenses;

    try {
      if (isEditing) {
        const res = await api.put(`${endpoint}/${currentExpenseId}`, formData);
        stateUpdater(currentState.map(item => item.id === currentExpenseId ? res.data : item));
      } else {
        const res = await api.post(endpoint, formData);
        stateUpdater([res.data, ...currentState].sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
      handleCloseModal();
    } catch (error) {
      console.error(`Failed to save ${transactionType}`, error);
    }
  };

  const handleDelete = async (id, type = 'expense') => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      const endpoint = type === 'income' ? '/incomes' : '/expenses';
      const stateUpdater = type === 'income' ? setIncomes : setExpenses;
      const currentState = type === 'income' ? incomes : expenses;
      
      try {
        await api.delete(`${endpoint}/${id}`);
        stateUpdater(currentState.filter(item => item.id !== id));
      } catch (error) {
        console.error(`Failed to delete ${type}`, error);
      }
    }
  };

  const handleCreateSavingPlan = async (planData) => {
    try {
      const res = await api.post('/saving_plans', planData);
      setSavingPlans([...savingPlans, res.data]);
      return true;
    } catch (error) {
      console.error('Failed to create saving plan', error);
      return false;
    }
  };

  const handleAddFundsToPlan = async (planId, fundsData) => {
    try {
      const res = await api.post(`/saving_plans/${planId}/funds`, fundsData);
      setSavingPlans(savingPlans.map(plan => plan.id === planId ? res.data : plan));
      return true;
    } catch (error) {
      console.error('Failed to add funds', error);
      return false;
    }
  };

  // Data Aggregations for HomeTab
  const totalExpenses = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const totalIncomes = incomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const totalSavings = savingPlans.reduce((acc, plan) => {
    const planTotal = plan.contributions?.reduce((sum, c) => sum + parseFloat(c.amount), 0) || 0;
    return acc + planTotal;
  }, 0);
  
  const netBalance = totalIncomes - totalExpenses - totalSavings;

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

  // Dynamic time options
  const timeOptions = React.useMemo(() => {
    const years = new Set();
    const months = new Set();
    expenses.forEach(exp => {
      const d = new Date(exp.date);
      years.add(d.getFullYear().toString());
      months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    });
    return {
      years: Array.from(years).sort().reverse(),
      months: Array.from(months).sort().reverse()
    };
  }, [expenses]);

  // Data Aggregation for ChartTab
  const processChartData = () => {
    let filteredExpenses = [...expenses];
    let filteredIncomes = [...incomes];
    let allSavings = savingPlans.flatMap(p => (p.contributions || []).map(c => ({...c, planName: p.name})));
    let filteredSavings = [...allSavings];

    if (timeFilter.startsWith('month-')) {
      const [_, year, month] = timeFilter.split('-');
      const filterFn = item => {
        const d = new Date(item.date);
        return d.getFullYear() === parseInt(year) && d.getMonth() + 1 === parseInt(month);
      };
      filteredExpenses = filteredExpenses.filter(filterFn);
      filteredIncomes = filteredIncomes.filter(filterFn);
      filteredSavings = filteredSavings.filter(filterFn);
    } else if (timeFilter.startsWith('year-')) {
      const year = timeFilter.split('-')[1];
      const filterFn = item => {
        const d = new Date(item.date);
        return d.getFullYear() === parseInt(year);
      };
      filteredExpenses = filteredExpenses.filter(filterFn);
      filteredIncomes = filteredIncomes.filter(filterFn);
      filteredSavings = filteredSavings.filter(filterFn);
    }

    const aggregated = {};
    
    const aggregateData = (data, typeKey) => {
      data.forEach(item => {
        let key;
        const d = new Date(item.date);
        if (timeFilter.startsWith('month-')) {
          key = d.getDate().toString();
        } else if (timeFilter.startsWith('year-')) {
          key = d.toLocaleDateString('en-US', { month: 'short' });
        } else {
          key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        }
        
        if (!aggregated[key]) {
          aggregated[key] = { expenseAmount: 0, incomeAmount: 0, savingAmount: 0 };
        }
        aggregated[key][typeKey] += parseFloat(item.amount);
      });
    };

    aggregateData(filteredExpenses, 'expenseAmount');
    aggregateData(filteredIncomes, 'incomeAmount');
    aggregateData(filteredSavings, 'savingAmount');

    let sortedKeys;
    if (timeFilter.startsWith('month-')) {
      sortedKeys = Object.keys(aggregated).sort((a, b) => parseInt(a) - parseInt(b));
    } else if (timeFilter.startsWith('year-')) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      sortedKeys = Object.keys(aggregated).sort((a, b) => months.indexOf(a) - months.indexOf(b));
    } else {
      sortedKeys = Object.keys(aggregated).sort();
    }

    const categoryAggregated = { expense: {}, income: {}, saving: {} };

    filteredExpenses.forEach(exp => {
      const catName = exp.category?.name || 'Uncategorized';
      if (!categoryAggregated.expense[catName]) {
        categoryAggregated.expense[catName] = { amount: 0, color: exp.category?.color || '#ccc' };
      }
      categoryAggregated.expense[catName].amount += parseFloat(exp.amount);
    });

    filteredIncomes.forEach(inc => {
      const catName = inc.category?.name || 'Uncategorized';
      if (!categoryAggregated.income[catName]) {
        categoryAggregated.income[catName] = { amount: 0, color: inc.category?.color || '#ccc' };
      }
      categoryAggregated.income[catName].amount += parseFloat(inc.amount);
    });

    const savingPalette = ['#5a5ca8', '#df5584', '#fe6842', '#feb944', '#a3e635', '#06b6d4'];
    let savingColorIndex = 0;
    filteredSavings.forEach(sav => {
      const planName = sav.planName || 'Unknown Plan';
      if (!categoryAggregated.saving[planName]) {
        categoryAggregated.saving[planName] = { amount: 0, color: savingPalette[savingColorIndex % savingPalette.length] };
        savingColorIndex++;
      }
      categoryAggregated.saving[planName].amount += parseFloat(sav.amount);
    });

    const categoryData = {
      expense: Object.keys(categoryAggregated.expense).map(key => ({
        name: key,
        amount: categoryAggregated.expense[key].amount,
        color: categoryAggregated.expense[key].color
      })).sort((a,b) => b.amount - a.amount),
      income: Object.keys(categoryAggregated.income).map(key => ({
        name: key,
        amount: categoryAggregated.income[key].amount,
        color: categoryAggregated.income[key].color
      })).sort((a,b) => b.amount - a.amount),
      saving: Object.keys(categoryAggregated.saving).map(key => ({
        name: key,
        amount: categoryAggregated.saving[key].amount,
        color: categoryAggregated.saving[key].color
      })).sort((a,b) => b.amount - a.amount),
    };

    return {
      timelineData: sortedKeys.map(key => ({
        name: key,
        expenseAmount: aggregated[key].expenseAmount,
        incomeAmount: aggregated[key].incomeAmount,
        savingAmount: aggregated[key].savingAmount
      })),
      categoryData
    };
  };
  const chartData = processChartData();

  // Render the current tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeTab 
            netBalance={netBalance}
            totalIncomes={totalIncomes}
            totalExpenses={totalExpenses}
            largestCategory={largestCategory}
            incomes={incomes}
            expenses={expenses}
            handleOpenModal={handleOpenModal}
            handleDelete={handleDelete}
          />
        );
      case 'chart':
        return (
          <ChartTab 
            chartData={chartData.timelineData}
            categoryData={chartData.categoryData}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            viewType={viewType}
            setViewType={setViewType}
            timeOptions={timeOptions}
            expenses={expenses}
            incomes={incomes}
          />
        );
      case 'plan':
        return (
          <PlanTab 
            savingPlans={savingPlans} 
            handleCreateSavingPlan={handleCreateSavingPlan} 
            handleAddFundsToPlan={handleAddFundsToPlan} 
          />
        );
      case 'settings':
        return <SettingsTab user={user} logout={logout} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-bajet-dark overflow-hidden font-sans text-gray-800 dark:text-bajet-cream">
      {/* Desktop Sidebar */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} user={user} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-full w-full max-w-full">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white dark:bg-bajet-dark border-b border-gray-200 dark:border-[#3f3f3f] p-4 sticky top-0 z-10 flex justify-between items-center shadow-sm shrink-0">
          <div className="w-48"><LogoDoodle fontSize="1.5rem" /></div>
          {user?.profile_picture ? (
            <img src={`http://localhost:8000/storage/${user.profile_picture}`} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-bajet-purple shadow-[0_0_10px_rgba(90,92,168,0.5)]" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-bajet-purple text-bajet-cream font-bold flex items-center justify-center text-sm shadow-[0_0_10px_rgba(90,92,168,0.5)]">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex bg-white dark:bg-bajet-dark border-b border-gray-200 dark:border-[#3f3f3f] p-6 justify-between items-center shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-bajet-purple dark:text-bajet-yellow capitalize">{currentTab}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name}!</p>
          </div>
            <button 
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-bajet-purple text-bajet-cream rounded-lg hover:bg-[#6c6ebe] transition-colors font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(90,92,168,0.4)]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Add Transaction
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#2f2f2f] p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-[#4a4a4a] relative">
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:hover:text-bajet-cream"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-bajet-cream mb-6">
              {isEditing ? `Edit ${transactionType === 'income' ? 'Income' : 'Expense'}` : 'Add New Transaction'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              {!isEditing && (
                <div className="flex bg-gray-100 dark:bg-[#3a3a3a] rounded-lg p-1 mb-6 border border-gray-200 dark:border-[#4a4a4a]">
                  <button 
                    type="button" 
                    onClick={() => {
                      setTransactionType('expense');
                      const expenseCats = categories.filter(c => c.type === 'expense');
                      setFormData(prev => ({ ...prev, category_id: expenseCats.length > 0 ? expenseCats[0].id : '' }));
                    }}
                    className={`flex-1 py-2 px-4 text-sm font-bold rounded-md transition-all ${transactionType === 'expense' ? 'bg-bajet-pink text-white shadow' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-bajet-cream'}`}
                  >
                    Expense
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setTransactionType('income');
                      const incomeCats = categories.filter(c => c.type === 'income');
                      setFormData(prev => ({ ...prev, category_id: incomeCats.length > 0 ? incomeCats[0].id : '' }));
                    }}
                    className={`flex-1 py-2 px-4 text-sm font-bold rounded-md transition-all ${transactionType === 'income' ? 'bg-[#a3e635] text-gray-900 shadow' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-bajet-cream'}`}
                  >
                    Income
                  </button>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <input 
                    type="text" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    className="w-full bg-gray-50 dark:bg-[#3a3a3a] text-gray-900 dark:text-bajet-cream rounded-lg p-3 border border-gray-200 dark:border-[#4a4a4a] focus:ring-2 focus:ring-bajet-purple outline-none" 
                    placeholder="e.g. Groceries"
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (RM)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="amount" 
                    value={formData.amount} 
                    onChange={handleInputChange} 
                    className="w-full bg-gray-50 dark:bg-[#3a3a3a] text-gray-900 dark:text-bajet-cream rounded-lg p-3 border border-gray-200 dark:border-[#4a4a4a] focus:ring-2 focus:ring-bajet-purple outline-none" 
                    placeholder="0.00"
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select 
                      name="category_id" 
                      value={formData.category_id} 
                      onChange={handleInputChange} 
                      className="w-full bg-gray-50 dark:bg-[#3a3a3a] text-gray-900 dark:text-bajet-cream rounded-lg p-3 border border-gray-200 dark:border-[#4a4a4a] focus:ring-2 focus:ring-bajet-purple outline-none cursor-pointer" 
                      required
                    >
                      <option value="" disabled>Select</option>
                      {categories.filter(c => c.type === transactionType).map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input 
                      type="date" 
                      name="date" 
                      value={formData.date} 
                      onChange={handleInputChange} 
                      className="w-full bg-gray-50 dark:bg-[#3a3a3a] text-gray-900 dark:text-bajet-cream rounded-lg p-3 border border-gray-200 dark:border-[#4a4a4a] focus:ring-2 focus:ring-bajet-purple outline-none text-sm cursor-pointer" 
                      required 
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-[#3a3a3a] text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-[#4a4a4a] transition-colors border border-gray-200 dark:border-[#4a4a4a]">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-bajet-purple text-bajet-cream font-medium rounded-lg hover:bg-[#6c6ebe] transition-colors shadow-[0_0_15px_rgba(90,92,168,0.4)]">{isEditing ? 'Save Changes' : `Add ${transactionType === 'income' ? 'Income' : 'Expense'}`}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
