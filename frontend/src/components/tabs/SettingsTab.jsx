import React from 'react';

const SettingsTab = ({ user, logout }) => {
  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 font-bold text-2xl flex items-center justify-center">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-lg text-gray-900">{user?.name}</p>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Currency</p>
                <p className="text-sm text-gray-500">Currently fixed to RM</p>
              </div>
              <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">RM</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-500">Coming soon</p>
              </div>
              <div className="w-11 h-6 bg-gray-200 rounded-full cursor-not-allowed"></div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full sm:w-auto px-6 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Log out of your account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
