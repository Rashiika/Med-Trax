import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  Users,
  User,
  Video,
  ShoppingCart
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'appointments', icon: Calendar },
    { id: 'chats', label: 'chats', icon: MessageSquare },
    { id: 'community', label: 'community', icon: Users },
    { id: 'profile', label: 'profile', icon: User },
    { id: 'counselling', label: 'counselling', icon: Video },
    { id: 'buy-medicine', label: 'buy medicine', icon: ShoppingCart }
  ];

  return (
    <div className="w-72 bg-gradient-to-b from-teal-600 to-teal-700 h-screen fixed left-0 top-0 shadow-2xl">
      <div className="h-32 border-b border-teal-500 bg-teal-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
              </svg>
            </div>
          </div>
          <h2 className="text-white font-bold text-lg">HealthCare+</h2>
        </div>
      </div>
      
      <nav className="mt-4 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 mb-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-white text-teal-700 shadow-lg transform scale-105'
                  : 'bg-teal-700/50 text-teal-50 hover:bg-teal-600/70 hover:transform hover:translate-x-1'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                isActive ? 'bg-teal-100' : 'bg-teal-600/50'
              }`}>
                <Icon size={20} className={isActive ? 'text-teal-700' : 'text-teal-100'} />
              </div>
              <span className="font-semibold text-base lowercase">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400"></div>
    </div>
  );
};

export const DashboardLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-teal-50 min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="ml-72 flex-1">
        <div className="bg-white shadow-md p-6 border-b-4 border-teal-500">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-teal-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h2>
          </div>
        </div>

        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};