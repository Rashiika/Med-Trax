import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logo from "../../assets/logo.png";
import { logout } from "../../redux/features/authSlice";
import { LogOut } from "lucide-react";

const SidebarItem = ({ icon, label, to, isLogout = false, onClick }) => {
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogoutConfirm = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`w-82 bg-white border-r fixed md:static h-full transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0 z-20" : "-translate-x-full"} md:translate-x-0 z-10`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center p-4 ">
            <img src={logo} alt="MedTrax" className="h-14" />
          </div>

          {/* Sidebar Navigation */}
          <nav className="p-4 space-y-1 flex-1">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.label}
                label={item.label}
                to={item.to}
                icon={item.icon}
              />
            ))}

            {/* ✅ Logout Item */}
            <SidebarItem
              label="Log Out"
              icon={<LogOut className="w-5 h-5 text-red-600" />}
              isLogout
              onClick={() => setShowLogoutConfirm(true)}
            />
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-hidden h-full">
          {children}
        </main>
      </div>

      {/* ✅ Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Logout
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
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
