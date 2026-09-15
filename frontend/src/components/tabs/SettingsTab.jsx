import React from 'react';

const SettingsTab = ({ user, handleLogout, logout }) => {
  const onLogout = handleLogout || logout;

  return (
    <div className="animate-fade-in-up space-y-6 max-w-2xl mx-auto">
      <div className="bg-[#3a3a3a] p-6 rounded-xl shadow-sm border border-[#4a4a4a]">
        <h3 className="text-lg font-semibold text-bajet-cream mb-4">Profile Information</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#2f2f2f] border-2 border-bajet-purple text-bajet-cream font-bold flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(90,92,168,0.3)]">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-bold text-bajet-cream text-lg">{user?.name || 'User'}</p>
            <p className="text-gray-400">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#3a3a3a] p-6 rounded-xl shadow-sm border border-[#4a4a4a]">
        <h3 className="text-lg font-semibold text-bajet-cream mb-4">Account</h3>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2f2f2f] border border-[#4a4a4a] text-bajet-pink hover:bg-[#4a4a4a] hover:border-bajet-pink font-medium rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Log out of your account
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;
