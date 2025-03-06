import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AccountSettings = () => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <h1 className="text-2xl font-semibold mb-8">ACCOUNT SETTING</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8 animate-in" style={{ animationDelay: '100ms' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-sky-500 flex-shrink-0">
              <img 
                src="/lovable-uploads/ee6f74d2-cb92-47f8-9971-f947f6e0a573.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-x-16 gap-y-4 flex-grow">
              <div>
                <p className="text-sm text-gray-500">Display name</p>
                <p className="font-medium">Kevin</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium">Kevin.smith</p>
              </div>
            </div>
          </div>
          <button className="btn-orange">SAVE CHANGES</button>
        </div>
      </div>
      
      <div className="mt-16 max-w-xl animate-in" style={{ animationDelay: '300ms' }}>
        <h2 className="ext-lg font-medium mb-6">CHANGE PASSWORD</h2>
        <div className="space-y-4">
          {['current', 'new', 'confirm'].map((field) => (
            <div className="relative" key={field}>
              <label className="text-sm text-gray-500 block mb-1">
                {field === 'current' ? 'Current Password' : field === 'new' ? 'New Password' : 'Confirm Password'}
              </label>
              <div className="relative">
                <input 
                  type={showPassword[field] ? "text" : "password"} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-orange-500"
                  placeholder={field === 'current' ? "••••••••••" : "8+ characters"}
                />
                <button 
                  onClick={() => togglePasswordVisibility(field)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword[field] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="bg-orange-500 mt-6">CHANGE PASSWORD</button>
      </div>
    </div>
  );
};

export default AccountSettings;
