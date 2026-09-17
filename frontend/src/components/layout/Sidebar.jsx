import React from 'react';
import LogoDoodle from './LogoDoodle';

const Sidebar = ({ currentTab, setCurrentTab, user }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: (
      <svg className="w-5 h-5 mr-3" fill={currentTab === 'home' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
    )},
    { id: 'chart', label: 'Report', icon: (
      <svg className="w-5 h-5 mr-3" fill={currentTab === 'chart' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
    )},
    { id: 'plan', label: 'Plan', icon: (
      <svg className="w-5 h-5 mr-3" fill={currentTab === 'plan' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
    )},
    { id: 'settings', label: 'Settings', icon: (
      <svg className="w-5 h-5 mr-3" fill={currentTab === 'settings' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
    )}
  ];

  return (
    <div className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#232323] border-r border-gray-200 dark:border-[#3f3f3f] min-h-screen">
      <div className="p-6">
        <LogoDoodle fontSize="2rem" />
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                isActive 
                  ? 'bg-bajet-purple text-bajet-cream shadow-[0_0_15px_rgba(90,92,168,0.4)]' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[#2f2f2f] dark:hover:text-bajet-cream'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </nav>
      {user && (
        <div className="p-4 m-4 mt-auto border border-gray-200 dark:border-[#3f3f3f] rounded-xl flex items-center gap-3 bg-gray-50 dark:bg-[#2f2f2f]">
          {user.profile_picture ? (
            <img src={`http://localhost:8000/storage/${user.profile_picture}`} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-bajet-purple shadow-[0_0_10px_rgba(90,92,168,0.5)]" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-bajet-purple text-bajet-cream font-bold flex items-center justify-center text-sm shadow-[0_0_10px_rgba(90,92,168,0.5)]">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-bajet-cream truncate">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
