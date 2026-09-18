import React, { useContext, useRef, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';

const SettingsTab = ({ user, handleLogout, logout }) => {
  const onLogout = handleLogout || logout;
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { uploadProfilePicture, updateProfileName } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [isSavingName, setIsSavingName] = useState(false);

  const handleSaveName = async () => {
    if (!newName.trim() || newName === user?.name) {
      setIsEditingName(false);
      return;
    }
    setIsSavingName(true);
    try {
      await updateProfileName(newName);
      setIsEditingName(false);
    } catch (error) {
      console.error("Failed to save name", error);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        await uploadProfilePicture(file);
      } catch (err) {
        console.error("Failed to upload profile picture", err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="animate-fade-in-up space-y-6 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-[#3a3a3a] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-[#4a4a4a]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-bajet-cream mb-4">Profile Information</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
            <div className="relative group shrink-0">
              {user?.profile_picture ? (
                <img src={`http://localhost:8000/storage/${user.profile_picture}`} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-bajet-purple shadow-[0_0_15px_rgba(90,92,168,0.3)]" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#2f2f2f] border-2 border-bajet-purple text-gray-800 dark:text-bajet-cream font-bold flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(90,92,168,0.3)]">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Change Profile Picture"
              >
                {isUploading ? (
                  <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                )}
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <div className="flex items-center gap-2 mb-1">
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    className="bg-gray-100 dark:bg-[#2f2f2f] text-gray-800 dark:text-bajet-cream rounded px-2 py-1 text-base sm:text-lg font-bold outline-none border border-bajet-purple flex-1 min-w-[120px] max-w-[200px]"
                    autoFocus
                  />
                  <button onClick={handleSaveName} disabled={isSavingName} className="text-bajet-purple dark:text-bajet-yellow p-1 rounded hover:bg-gray-100 dark:hover:bg-[#4a4a4a] shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </button>
                  <button onClick={() => {setIsEditingName(false); setNewName(user?.name);}} className="text-gray-500 hover:text-red-500 p-1 rounded hover:bg-gray-100 dark:hover:bg-[#4a4a4a] shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-800 dark:text-bajet-cream text-lg truncate">{user?.name || 'User'}</p>
                  <button onClick={() => {setNewName(user?.name); setIsEditingName(true);}} className="text-gray-400 hover:text-bajet-purple dark:hover:text-bajet-yellow transition-colors shrink-0" title="Edit Username">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                </div>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full sm:w-auto shrink-0 px-4 py-2 text-sm bg-gray-50 dark:bg-[#2f2f2f] hover:bg-gray-100 dark:hover:bg-[#4a4a4a] text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-200 dark:border-[#4a4a4a] transition-colors whitespace-nowrap"
          >
            {isUploading ? 'Uploading...' : 'Change Picture'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#3a3a3a] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-[#4a4a4a]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-bajet-cream mb-4">Account</h3>
        
        <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-[#4a4a4a] mb-4">
          <div>
            <h4 className="font-medium text-gray-800 dark:text-bajet-cream">Dark Mode</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark and light themes</p>
          </div>
          <button 
            onClick={toggleTheme}
            className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-bajet-purple' : 'bg-gray-300'}`}
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}></div>
          </button>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 dark:bg-[#2f2f2f] border border-gray-200 dark:border-[#4a4a4a] text-bajet-pink hover:bg-gray-100 dark:hover:bg-[#4a4a4a] hover:border-bajet-pink font-medium rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Log out of your account
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;
