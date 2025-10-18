import React from "react";
import hospitalImg from "../../assets/hospital.png";
import logo from "../../assets/logo.png";

const FormLayout = ({ children }) => {
  return (
    // Base layout: full screen height, column-flex on mobile, row-flex on desktop
    <div className="flex flex-col md:flex-row h-screen w-full bg-white font-[Inter]">
      
      {/* 1. Image Container (Hidden on mobile, 50% width on desktop) */}
      <div className="hidden md:block md:w-1/2 h-full relative">
        <img
          src={hospitalImg}
          alt="Hospital"
          // Image styling: covers container, full height/width, rounded on the right for desktop
          className="w-full h-full object-cover rounded-none md:rounded-r-[100px]"
        />
      </div>

      {/* 2. Form Container (Full width on mobile, 50% width on desktop) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-8 py-8 overflow-y-auto">
        
        {/* Inner container to center and limit the form's width */}
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          
          {/* Logo */}
          <div className="mb-16">
            {/* Logo sizes responsively from w-28 on mobile to w-40 on desktop */}
            <img src={logo} alt="Logo" className="w-28 sm:w-36 md:w-40 h-auto" />
          </div>

          {/* Form Content (children props) */}
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default FormLayout;