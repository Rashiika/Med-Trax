import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png'; 

const SidebarItem = ({ icon, label, to, isSelected }) => (
  <NavLink
    to={to}
    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 
      ${isSelected ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
  >
    {typeof icon === 'string' ? (
      icon.startsWith('http') || icon.includes('.') ? (
        <img src={icon} alt={label} className="w-5 h-5" />
      ) : (
        <span className="w-5 h-5 text-center">{icon}</span>
      )
    ) : (
      <span className="w-5 h-5 text-center">📄</span>
    )}
    <span>{label}</span>
  </NavLink>
);

const DashboardLayout = ({ sidebarItems = [], children, role = "patient" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      <div 
        className={`w-64 bg-white border-r fixed md:static h-full transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? 'translate-x-0 z-20' : '-translate-x-full'} md:translate-x-0 z-10`}
      >
        <div className="flex items-center justify-center p-4 border-b">
          <img src={logo} alt="Med-Trax" className="h-14 mr-2" />
        </div>
        
        <nav className="p-4 space-y-2">
          {sidebarItems.length > 0 ? (
            sidebarItems.map((item) => (
              <SidebarItem
                key={item.label}
                label={item.label}
                to={item.to}
                icon={item.icon}
                isSelected={window.location.pathname.startsWith(item.to)} 
              />
            ))
          ) : (
            <div className="text-gray-500 text-sm p-3">No navigation items</div>
          )}
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-16 bg-white border-b px-6 shadow-sm">
          <div className="relative flex items-center w-full max-w-md">
            <input
              type="text"
              placeholder="Search Doctors and Hospitals"
              className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-3 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-700 rounded-full transition-colors">
              🔔
            </button>
            <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <span className="text-sm font-medium">
                {role === 'patient' ? '+ Create Schedule' : '+ View Profile'}
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;