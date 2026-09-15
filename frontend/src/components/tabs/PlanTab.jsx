import React from 'react';

const PlanTab = () => {
  return (
    <div className="animate-fade-in-up bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="bg-indigo-50 p-4 rounded-full mb-4">
        <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Planning & Goals</h2>
      <p className="text-gray-500 max-w-md">Set budgeting goals and track your savings over time. This feature is coming soon!</p>
    </div>
  );
};

export default PlanTab;
