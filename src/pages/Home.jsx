import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectRole } from "../redux/features/authSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [isHovering, setIsHovering] = useState(null);

  const handleRoleSelect = async () => {
    if (selectedRole) {
      try {
        await dispatch(selectRole(selectedRole)).unwrap(); 
        navigate("/signup");
      } catch (error) {
        console.error("Role selection failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 relative overflow-hidden">
      {/* Enhanced Animated background with medical patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Floating blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Medical pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="medical-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 20 L50 80 M20 50 L80 50" stroke="#2563eb" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="50" cy="50" r="25" fill="none" stroke="#14b8a6" strokeWidth="2"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#medical-pattern)" />
          </svg>
        </div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-teal-400 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-float-fast"></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-float-slow"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-10 py-12">
          
          {/* Logo and Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-white rounded-full p-4 shadow-lg">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-20 w-20 text-teal-500"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Med-trax
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 font-medium mb-2">
              Welcome to Healthcare Excellence
            </p>
            <p className="text-base sm:text-lg text-gray-500 max-w-md mx-auto">
              Select your role to begin your journey with us
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="flex flex-col sm:flex-row gap-8 mb-12 animate-slide-up">
            
            {/* Doctor Card */}
            <div
              onClick={() => setSelectedRole("doctor")}
              onMouseEnter={() => setIsHovering("doctor")}
              onMouseLeave={() => setIsHovering(null)}
              className={`group cursor-pointer relative rounded-2xl p-8 w-72 h-80 transition-all duration-500 transform hover:scale-105 ${
                selectedRole === "doctor"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-2xl scale-105"
                  : "bg-white shadow-lg hover:shadow-2xl"
              }`}
            >
              {selectedRole === "doctor" && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-75 blur-sm animate-pulse"></div>
              )}
              
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className={`mb-6 transition-all duration-500 ${
                  selectedRole === "doctor" || isHovering === "doctor" ? "transform -translate-y-2" : ""
                }`}>
                  <div className={`relative ${
                    selectedRole === "doctor" ? "text-white" : "text-blue-500"
                  }`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-24 h-24 transition-all duration-300"
                      viewBox="0 0 111 128"
                      fill="currentColor"
                    >
                      <path d="M103.497 90.4C95.4969 75.2 87.4969 77.6 78.6969 76.8C79.4969 79.2 79.4969 81.6 79.4969 84.8C92.2969 88 95.4969 103.2 95.4969 112V120H79.4969V112H87.4969C87.4969 112 87.4969 92 75.4969 92C63.4969 92 63.4969 111.2 63.4969 112H71.4969V120H55.4969V112C55.4969 103.2 58.6969 87.2 71.4969 84.8C71.4969 80 70.6969 76 69.8969 74.4C68.2969 73.6 66.6969 72 66.6969 69.6C66.6969 64.8 73.0969 66.4 77.8969 57.6C77.8969 57.6 85.0969 39.2 82.6969 23.2H74.6969C74.6969 21.6 75.4969 20.8 75.4969 19.2C75.4969 17.6 75.4969 16.8 74.6969 15.2H81.0969C78.6969 7.2 70.6969 0 55.4969 0C40.2969 0 32.2969 7.2 29.0969 16H35.4969C35.4969 17.6 34.6969 18.4 34.6969 20C34.6969 21.6 34.6969 22.4 35.4969 24H27.4969C25.8969 40 32.2969 58.4 32.2969 58.4C37.0969 66.4 43.4969 64.8 43.4969 70.4C43.4969 74.4 39.4969 76 34.6969 76.8C33.0969 78.4 31.4969 81.6 31.4969 88V97.6C36.2969 99.2 39.4969 104 39.4969 108.8C39.4969 114.4 33.8969 120 27.4969 120C21.0969 120 15.4969 114.4 15.4969 108C15.4969 102.4 18.6969 98.4 23.4969 96.8V87.2C23.4969 83.2 24.2969 80 25.0969 76.8C19.4969 77.6 13.0969 80 7.49687 90.4C2.69687 99.2 0.296875 128 0.296875 128H109.897C110.697 128 108.297 99.2 103.497 90.4ZM43.4969 20C43.4969 13.6 49.0969 8 55.4969 8C61.8969 8 67.4969 13.6 67.4969 20C67.4969 26.4 61.8969 32 55.4969 32C49.0969 32 43.4969 26.4 43.4969 20Z" />
                    </svg>
                  </div>
                </div>
                
                <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
                  selectedRole === "doctor" ? "text-white" : "text-gray-800"
                }`}>
                  Doctor
                </h3>
                
                <p className={`text-sm text-center transition-colors duration-300 ${
                  selectedRole === "doctor" ? "text-blue-100" : "text-gray-600"
                }`}>
                  Manage appointments, prescriptions & patient care
                </p>

                {selectedRole === "doctor" && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-blue-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg animate-bounce-in">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Patient Card */}
            <div
              onClick={() => setSelectedRole("patient")}
              onMouseEnter={() => setIsHovering("patient")}
              onMouseLeave={() => setIsHovering(null)}
              className={`group cursor-pointer relative rounded-2xl p-8 w-72 h-80 transition-all duration-500 transform hover:scale-105 ${
                selectedRole === "patient"
                  ? "bg-gradient-to-br from-teal-500 to-teal-600 shadow-2xl scale-105"
                  : "bg-white shadow-lg hover:shadow-2xl"
              }`}
            >
              {selectedRole === "patient" && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400 via-green-400 to-teal-400 opacity-75 blur-sm animate-pulse"></div>
              )}
              
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className={`mb-6 transition-all duration-500 ${
                  selectedRole === "patient" || isHovering === "patient" ? "transform -translate-y-2" : ""
                }`}>
                  <div className={`relative ${
                    selectedRole === "patient" ? "text-white" : "text-teal-500"
                  }`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-24 h-24 transition-all duration-300"
                      viewBox="0 0 129 128"
                      fill="currentColor"
                    >
                      <path d="M21.7876 71.4544C21.787 70.3411 22.0061 69.2386 22.4322 68.2101C22.8583 67.1816 23.4831 66.2472 24.2707 65.4605C25.0584 64.6737 25.9935 64.0501 27.0225 63.6252C28.0516 63.2003 29.1543 62.9825 30.2676 62.9844C31.381 62.9828 32.4838 63.2007 33.5129 63.6256C34.542 64.0506 35.4773 64.6742 36.2652 65.4608C37.0532 66.2475 37.6783 67.1817 38.105 68.2101C38.5316 69.2386 38.7513 70.341 38.7516 71.4544C38.7516 73.704 37.8579 75.8614 36.2672 77.4521C34.6766 79.0428 32.5191 79.9364 30.2696 79.9364C28.02 79.9364 25.8626 79.0428 24.2719 77.4521C22.6812 75.8614 21.7876 73.704 21.7876 71.4544ZM103.696 66.2664C107.426 66.2664 110.438 69.1904 110.47 72.8924L110.484 90.7804H42.4176V66.2844L103.696 66.2664ZM34.5796 90.7664C36.8816 90.7664 38.7516 88.8964 38.7516 86.5944C38.7516 84.2924 36.8816 82.4224 34.5796 82.4224H22.5196C21.9718 82.4221 21.4294 82.5299 20.9233 82.7395C20.4172 82.9491 19.9575 83.2565 19.5703 83.644C19.1832 84.0315 18.8763 84.4916 18.6672 84.9978C18.458 85.5041 18.3508 86.0466 18.3516 86.5944C18.3516 88.8964 20.2076 90.7664 22.5196 90.7664H34.5796Z" />
                      <path d="M114.517 108.361V127.015H125.563V67.8593C125.564 67.1351 125.422 66.4178 125.146 65.7485C124.869 65.0792 124.464 64.4709 123.952 63.9585C123.44 63.4461 122.833 63.0395 122.164 62.762C121.495 62.4845 120.778 62.3415 120.053 62.3413C118.588 62.3391 117.181 62.9192 116.143 63.954C115.105 64.9888 114.52 66.3935 114.517 67.8593V95.0092H15.3395V56.6992C15.3395 53.6532 12.6835 51.1753 9.6295 51.1753V51.1792C6.5855 51.1792 4.1875 53.6533 4.1875 56.6973V127.013H15.3375V108.359L114.517 108.361ZM79.5155 0.28325C83.0495 0.28325 88.8375 1.76925 92.0575 5.29325L87.7175 13.6293C86.7503 12.3743 85.5077 11.3585 84.0856 10.6601C82.6635 9.96165 81.0999 9.59939 79.5155 9.60125C76.2175 9.60125 73.2835 11.1412 71.3855 13.5472L66.9595 5.47725C70.6855 1.74925 75.8375 0.28125 79.5155 0.28125V0.28325ZM78.2655 8.68325H80.7415V6.20525H83.2195V3.73325H80.7415V1.25725H78.2655V3.73325H75.7915V6.20525H78.2655V8.68325Z" />
                      <path d="M87.4652 20.4886C87.4652 22.6011 86.626 24.627 85.1323 26.1207C83.6386 27.6145 81.6126 28.4536 79.5002 28.4536C77.3877 28.4536 75.3618 27.6145 73.8681 26.1207C72.3744 24.627 71.5352 22.6011 71.5352 20.4886C71.5352 18.3762 72.3744 16.3502 73.8681 14.8565C75.3618 13.3628 77.3877 12.5236 79.5002 12.5236C81.6126 12.5236 83.6386 13.3628 85.1323 14.8565C86.626 16.3502 87.4652 18.3762 87.4652 20.4886ZM71.8412 30.7226C66.2732 30.7526 63.0472 35.2706 62.3212 37.8226L55.5372 60.0886H62.4032L67.4032 43.0046H70.9612L65.9752 60.0846H92.9892L88.0392 43.0046H91.5952L96.7272 60.0886H103.491L96.6812 37.8226C95.9572 35.3026 92.7992 30.8706 87.3532 30.7346L71.8412 30.7226ZM21.0872 35.8426C11.3112 35.8426 3.36719 27.8946 3.36719 18.1186C3.36719 8.34062 11.3092 0.390625 21.0872 0.390625C30.8592 0.390625 38.8152 8.34262 38.8152 18.1186C38.8152 27.8946 30.8572 35.8426 21.0872 35.8426ZM21.0812 31.4546C28.4372 31.4546 34.4252 25.4726 34.4252 18.1146C34.4252 10.7646 28.4392 4.77262 21.0812 4.77262C13.7292 4.77262 7.75119 10.7626 7.75119 18.1146C7.75119 25.4746 13.7292 31.4546 21.0812 31.4546Z" />
                      <path d="M21.1771 20.4597C20.9734 20.5536 20.7492 20.594 20.5256 20.5772C20.302 20.5604 20.0864 20.487 19.8991 20.3637C19.7404 20.2616 19.6054 20.1267 19.5033 19.968C19.4011 19.8092 19.3342 19.6305 19.3071 19.4437L19.2891 9.14173C19.3024 8.79713 19.4487 8.47109 19.6972 8.23201C19.9457 7.99293 20.2772 7.85938 20.6221 7.85938C20.9669 7.85938 21.2984 7.99293 21.5469 8.23201C21.7954 8.47109 21.9417 8.79713 21.9551 9.14173V17.1337L28.7871 13.9157C29.1033 13.7856 29.4575 13.782 29.7763 13.9058C30.0951 14.0296 30.354 14.2713 30.4995 14.5808C30.645 14.8903 30.6659 15.2439 30.5578 15.5683C30.4498 15.8928 30.2211 16.1633 29.9191 16.3237L21.1771 20.4597Z" />
                    </svg>
                  </div>
                </div>
                
                <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
                  selectedRole === "patient" ? "text-white" : "text-gray-800"
                }`}>
                  Patient
                </h3>
                
                <p className={`text-sm text-center transition-colors duration-300 ${
                  selectedRole === "patient" ? "text-teal-100" : "text-gray-600"
                }`}>
                  Book appointments, view records & connect with doctors
                </p>

                {selectedRole === "patient" && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-teal-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg animate-bounce-in">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleRoleSelect}
            disabled={!selectedRole}
            className={`group relative px-12 py-4 rounded-full text-lg font-bold transition-all duration-300 transform ${
              selectedRole
                ? "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-2xl hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              Continue
              {selectedRole && (
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </span>
            {selectedRole && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
            )}
          </button>
        </div>

        {/* What We Do Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-10 bg-white/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800">
                What We Do
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Revolutionizing healthcare management with intelligent solutions that streamline operations and enhance patient care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Hospital Management Card */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Smart Hospital Management
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Comprehensive digital platform that optimizes hospital operations, from patient registration to discharge. Real-time tracking of beds, resources, and staff allocation ensures maximum efficiency.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Digital patient records & history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Automated appointment scheduling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Real-time resource tracking</span>
                  </li>
                </ul>
              </div>

              {/* Traffic Management Card */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Efficient Patient Flow Management
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  AI-powered system that intelligently manages patient traffic, reducing wait times and bottlenecks. Predictive analytics help anticipate peak hours and optimize staff deployment.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Queue management & priority sorting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Real-time wait time estimates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Emergency prioritization system</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-sm text-gray-700 font-medium">Hospitals Managed</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-teal-600 mb-2">98%</div>
                <div className="text-sm text-gray-700 font-medium">Efficiency Rate</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
                <div className="text-sm text-gray-700 font-medium">Daily Patients</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-pink-600 mb-2">24/7</div>
                <div className="text-sm text-gray-700 font-medium">Support Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-10">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in-delay-1">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transform hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">24/7 Access</h4>
              <p className="text-sm text-gray-600">Round-the-clock healthcare services at your fingertips</p>
            </div>
            
            <div className="text-center animate-fade-in-delay-2">
              <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transform hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Secure & Private</h4>
              <p className="text-sm text-gray-600">Your data is encrypted with industry-leading security</p>
            </div>
            
            <div className="text-center animate-fade-in-delay-3">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transform hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Fast & Easy</h4>
              <p className="text-sm text-gray-600">Streamlined workflows for efficient healthcare</p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="py-16 px-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Transform Healthcare?
            </h3>
            <p className="text-lg mb-8 text-blue-100">
              Join thousands of healthcare professionals using Med-trax
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate("/signup")}
                className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
              >
                Get Started Free
              </button>
              <button className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-in {
          0% { transform: translate(-50%, 20px) scale(0); }
          50% { transform: translate(-50%, -10px) scale(1.2); }
          100% { transform: translate(-50%, 0) scale(1); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(-15px); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-40px) translateX(20px); }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out 0.2s both; }
        .animate-fade-in-delay-1 { animation: fade-in 0.6s ease-out 0.4s both; }
        .animate-fade-in-delay-2 { animation: fade-in 0.6s ease-out 0.6s both; }
        .animate-fade-in-delay-3 { animation: fade-in 0.6s ease-out 0.8s both; }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Home;