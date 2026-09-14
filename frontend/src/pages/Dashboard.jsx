import React, { useState, useContext } from 'react';
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

const dummyData = [
  { name: 'Mon', amount: 120 },
  { name: 'Tue', amount: 200 },
  { name: 'Wed', amount: 150 },
  { name: 'Thu', amount: 80 },
  { name: 'Fri', amount: 250 },
  { name: 'Sat', amount: 90 },
  { name: 'Sun', amount: 300 },
];

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [expenses] = useState([
    { id: 1, description: 'Groceries', amount: 120, category: 'Food', date: '2026-09-14' },
    { id: 2, description: 'Internet', amount: 80, category: 'Utilities', date: '2026-09-13' },
    { id: 3, description: 'Gas', amount: 50, category: 'Transport', date: '2026-09-12' },
  ]);

  return (
    <div className="min-h-screen p-8 font-sans text-gray-800 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expense Tracker Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.name}! Here's your financial overview.</p>
          </div>
          <button 
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Summary Cards */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Expenses (This Week)</h3>
            <p className="text-3xl font-bold text-gray-900">RM 1,190.00</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Largest Category</h3>
            <p className="text-3xl font-bold text-gray-900">Food</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Remaining Budget</h3>
            <p className="text-3xl font-bold text-green-600">RM 810.00</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Expenses Over Time</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dummyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} tickFormatter={(value) => `RM ${value}`} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value) => [`RM ${value}`, 'Amount']}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Expenses List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    <p className="text-xs text-gray-500">{expense.category} • {expense.date}</p>
                  </div>
                  <span className="font-semibold text-gray-900">RM {expense.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
              View All Expenses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
