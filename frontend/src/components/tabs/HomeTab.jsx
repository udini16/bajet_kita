import React from 'react';

const HomeTab = ({ totalExpenses, largestCategory, remainingBudget, expenses, handleOpenModal, handleDelete }) => {
  return (
    <div className="animate-fade-in-up">
      <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
        {/* Summary Cards */}
        <div className="bg-[#3a3a3a] p-3 sm:p-6 rounded-xl shadow-sm border border-[#4a4a4a] transform transition-transform hover:scale-105 flex flex-col justify-center">
          <h3 className="text-[10px] sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2 truncate" title="Total Expenses">Total</h3>
          <p className="text-sm sm:text-3xl font-bold text-bajet-cream truncate" title={`RM ${totalExpenses.toFixed(2)}`}>RM {totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-[#3a3a3a] p-3 sm:p-6 rounded-xl shadow-sm border border-[#4a4a4a] transform transition-transform hover:scale-105 flex flex-col justify-center">
          <h3 className="text-[10px] sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2 truncate" title="Largest Category">Largest</h3>
          <p className="text-sm sm:text-3xl font-bold text-bajet-cream truncate" title={largestCategory}>{largestCategory}</p>
        </div>
        <div className="bg-[#3a3a3a] p-3 sm:p-6 rounded-xl shadow-sm border border-[#4a4a4a] transform transition-transform hover:scale-105 flex flex-col justify-center">
          <h3 className="text-[10px] sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2 truncate" title="Remaining Budget (RM 3000)">Budget</h3>
          <p className={`text-sm sm:text-3xl font-bold truncate ${remainingBudget >= 0 ? 'text-[#a3e635]' : 'text-bajet-pink'}`} title={`RM ${remainingBudget.toFixed(2)}`}>
            RM {remainingBudget.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Recent Expenses List */}
      <div className="bg-[#3a3a3a] p-4 sm:p-6 rounded-xl shadow-sm border border-[#4a4a4a] flex flex-col max-h-[300px] sm:max-h-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-bajet-cream">Recent Expenses</h3>
          <button 
            onClick={() => handleOpenModal()}
            className="hidden sm:flex p-2 bg-bajet-purple text-bajet-cream rounded-full hover:bg-[#6c6ebe] transition-colors focus:outline-none shadow-[0_0_10px_rgba(90,92,168,0.4)]"
            title="Add New Expense"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-[#4a4a4a]">
          {expenses.length === 0 && (
            <p className="text-gray-400 text-center py-4">No expenses yet.</p>
          )}
          {expenses.map((expense) => (
            <div key={expense.id} className="flex flex-col p-3 border border-[#4a4a4a] hover:border-bajet-purple hover:shadow-[0_0_10px_rgba(90,92,168,0.2)] rounded-lg transition-all group bg-[#2f2f2f]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-bajet-cream">{expense.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span 
                      className="inline-block w-2 h-2 rounded-full" 
                      style={{ backgroundColor: expense.category?.color || '#ccc' }}
                    ></span>
                    <p className="text-xs font-medium text-gray-400">{expense.category?.name}</p>
                    <span className="text-xs text-gray-500">•</span>
                    <p className="text-xs text-gray-400">{expense.date}</p>
                  </div>
                </div>
                <span className="font-bold text-bajet-cream">RM {parseFloat(expense.amount).toFixed(2)}</span>
              </div>
              
              {/* Action Buttons (visible on hover) */}
              <div className="flex justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(expense)} className="text-xs text-bajet-yellow hover:text-[#ffd280] font-medium px-2 py-1 bg-[#3a3a3a] rounded border border-[#4a4a4a]">Edit</button>
                <button onClick={() => handleDelete(expense.id)} className="text-xs text-bajet-pink hover:text-[#f878a1] font-medium px-2 py-1 bg-[#3a3a3a] rounded border border-[#4a4a4a]">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
