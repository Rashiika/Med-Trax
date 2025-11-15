import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logo from "../../assets/logo.png";
import { logout } from "../../redux/features/authSlice";
import { LogOut, Menu, X } from "lucide-react";

const SidebarItem = ({ icon, label, to, isLogout = false, onClick, onNavigate }) => {
  const baseClasses =
    "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer";
  const activeClasses =
    "bg-blue-100 text-blue-700 border-l-4 border-blue-700 font-semibold";
  const inactiveClasses = isLogout
    ? "text-red-600 hover:bg-red-50 font-medium"
    : "text-gray-700 hover:bg-gray-50";

  if (isLogout) {
    return (
      <div onClick={onClick} className={`${baseClasses} ${inactiveClasses}`}>
        <LogOut className="w-5 h-5 text-red-600" />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
      }
    >
      {typeof icon === "string" ? (
        <img src={icon} alt={label} className="w-5 h-5" />
      ) : (
        <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      )}
      <span>{label}</span>
    </NavLink>
  );
};

const DashboardLayout = ({ sidebarItems = [], children, role = "patient" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogoutConfirm = () => {
    dispatch(logout());
    navigate("/login");
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          w-72 bg-white border-r h-full
          fixed md:static z-40
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center p-4 border-b md:border-none">
            <img src={logo} alt="MedTrax" className="h-14" />
          </div>

          {/* Sidebar Navigation */}
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.label}
                label={item.label}
                to={item.to}
                icon={item.icon}
                onNavigate={closeSidebar}
              />
            ))}

            {/* Logout Item */}
            <SidebarItem
              label="Log Out"
              icon={<LogOut className="w-5 h-5 text-red-600" />}
              isLogout
              onClick={() => {
                setShowLogoutConfirm(true);
                closeSidebar();
              }}
            />
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header Spacer */}
        <div className="h-16 md:hidden"></div>
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Logout
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;