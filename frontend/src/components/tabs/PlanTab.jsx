import React, { useState } from 'react';

const PlanTab = ({ savingPlans, handleCreateSavingPlan, handleAddFundsToPlan }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFundsModalOpen, setIsFundsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [createForm, setCreateForm] = useState({ name: '', target_amount: '' });
  const [fundsForm, setFundsForm] = useState({ amount: '', date: new Date().toISOString().split('T')[0], description: '' });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const success = await handleCreateSavingPlan(createForm);
    if (success) {
      setIsCreateModalOpen(false);
      setCreateForm({ name: '', target_amount: '' });
    }
  };

  const handleFundsSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;
    const success = await handleAddFundsToPlan(selectedPlan.id, fundsForm);
    if (success) {
      setIsFundsModalOpen(false);
      setSelectedPlan(null);
      setFundsForm({ amount: '', date: new Date().toISOString().split('T')[0], description: '' });
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-bajet-cream">Saving Plans</h3>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-bajet-purple text-bajet-cream rounded-lg hover:bg-[#6c6ebe] transition-colors font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(90,92,168,0.4)]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Create Plan
        </button>
      </div>

      {savingPlans.length === 0 ? (
        <div className="bg-white dark:bg-[#3a3a3a] p-12 rounded-xl shadow-sm border border-gray-200 dark:border-[#4a4a4a] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 dark:bg-[#2f2f2f] rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(90,92,168,0.3)] text-bajet-purple">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-bajet-cream mb-2">Start Saving Today</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">Create a saving plan for a vacation, a new car, or an emergency fund.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savingPlans.map(plan => {
            const currentAmount = plan.contributions?.reduce((sum, c) => sum + parseFloat(c.amount), 0) || 0;
            const targetAmount = parseFloat(plan.target_amount);
            const progress = Math.min((currentAmount / targetAmount) * 100, 100).toFixed(1);

            return (
              <div key={plan.id} className="bg-white dark:bg-[#3a3a3a] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-[#4a4a4a] hover:border-bajet-purple transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-bajet-cream">{plan.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{plan.contributions?.length || 0} contributions</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedPlan(plan); setIsFundsModalOpen(true); }}
                    className="text-sm px-3 py-1.5 bg-gray-50 dark:bg-[#2f2f2f] text-green-600 dark:text-[#a3e635] hover:bg-green-600 dark:hover:bg-[#a3e635] hover:text-white dark:hover:text-[#2f2f2f] font-medium rounded-md border border-gray-200 dark:border-[#4a4a4a] transition-all"
                  >
                    + Add Funds
                  </button>
                </div>
                
                <div className="mb-2 flex justify-between items-end">
                  <span className="text-2xl font-bold text-green-600 dark:text-[#a3e635]">RM {currentAmount.toFixed(2)}</span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/ RM {targetAmount.toFixed(2)}</span>
                </div>
                
                <div className="w-full bg-gray-100 dark:bg-[#2f2f2f] rounded-full h-3 mb-2 overflow-hidden border border-gray-200 dark:border-[#4a4a4a]">
                  <div className="bg-bajet-purple h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="text-right text-xs font-bold text-bajet-purple">{progress}% Completed</div>

                {plan.contributions?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#4a4a4a]">
                    <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Recent History</h5>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-[#4a4a4a]">
                      {[...plan.contributions].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(c => (
                        <div key={c.id} className="flex justify-between items-center text-sm">
                          <div>
                            <span className="text-gray-700 dark:text-gray-300 block">{c.description || 'Added funds'}</span>
                            <span className="text-xs text-gray-500">{c.date}</span>
                          </div>
                          <span className="text-green-600 dark:text-[#a3e635] font-medium">+RM {parseFloat(c.amount).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Plan Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#3a3a3a] rounded-2xl w-full max-w-md overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-scale-up border border-[#4a4a4a]">
            <div className="px-6 py-4 border-b border-[#4a4a4a] flex justify-between items-center bg-[#2f2f2f]">
              <h2 className="text-xl font-bold text-bajet-cream">Create Saving Plan</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-bajet-pink p-1 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Plan Name (e.g. Vacation)</label>
                  <input type="text" value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} required className="w-full px-4 py-2 border border-[#5a5ca8] rounded-lg bg-[#2f2f2f] text-bajet-cream outline-none focus:border-bajet-pink" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Target Goal (RM)</label>
                  <input type="number" step="0.01" value={createForm.target_amount} onChange={e => setCreateForm({...createForm, target_amount: e.target.value})} required className="w-full px-4 py-2 border border-[#5a5ca8] rounded-lg bg-[#2f2f2f] text-bajet-cream outline-none focus:border-bajet-pink" />
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-2 bg-[#2f2f2f] text-gray-300 rounded-lg border border-[#4a4a4a]">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-bajet-purple text-bajet-cream rounded-lg shadow-[0_0_15px_rgba(90,92,168,0.4)]">Create Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Funds Modal */}
      {isFundsModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#3a3a3a] rounded-2xl w-full max-w-md overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-scale-up border border-[#4a4a4a]">
            <div className="px-6 py-4 border-b border-[#4a4a4a] flex justify-between items-center bg-[#2f2f2f]">
              <h2 className="text-xl font-bold text-bajet-cream">Add Funds to {selectedPlan.name}</h2>
              <button onClick={() => { setIsFundsModalOpen(false); setSelectedPlan(null); }} className="text-gray-400 hover:text-bajet-pink p-1 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <form onSubmit={handleFundsSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Amount (RM)</label>
                  <input type="number" step="0.01" value={fundsForm.amount} onChange={e => setFundsForm({...fundsForm, amount: e.target.value})} required className="w-full px-4 py-2 border border-[#5a5ca8] rounded-lg bg-[#2f2f2f] text-bajet-cream outline-none focus:border-bajet-pink" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                  <input type="date" value={fundsForm.date} onChange={e => setFundsForm({...fundsForm, date: e.target.value})} required className="w-full px-4 py-2 border border-[#5a5ca8] rounded-lg bg-[#2f2f2f] text-bajet-cream outline-none focus:border-bajet-pink" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Note (Optional)</label>
                  <input type="text" value={fundsForm.description} onChange={e => setFundsForm({...fundsForm, description: e.target.value})} className="w-full px-4 py-2 border border-[#5a5ca8] rounded-lg bg-[#2f2f2f] text-bajet-cream outline-none focus:border-bajet-pink" placeholder="e.g. November Bonus" />
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button type="button" onClick={() => { setIsFundsModalOpen(false); setSelectedPlan(null); }} className="flex-1 py-2 bg-[#2f2f2f] text-gray-300 rounded-lg border border-[#4a4a4a]">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-[#a3e635] text-[#2f2f2f] font-bold rounded-lg shadow-[0_0_15px_rgba(163,230,53,0.4)]">Add Funds</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanTab;
