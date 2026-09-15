import React from 'react';

const PlanTab = () => {
  return (
    <div className="animate-fade-in-up bg-[#3a3a3a] p-6 rounded-xl shadow-sm border border-[#4a4a4a] h-[500px] flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-[#2f2f2f] rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(90,92,168,0.3)] text-bajet-purple">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
      </div>
      <h3 className="text-xl font-bold text-bajet-cream mb-2">Budget Planning</h3>
      <p className="text-gray-400 max-w-sm">
        Set monthly limits for your categories and track your progress. Coming soon!
      </p>
    </div>
  );
};

export default PlanTab;
