import React from "react";
import hospitalImg from "../../assets/hospital.png";
import logo from "../../assets/logo.png";

const FormLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-white font-[Inter]">
      
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 h-full relative">
        <img
          src={hospitalImg}
          alt="Hospital"
          className="w-full h-full object-cover rounded-none md:rounded-r-[100px]"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-8 lg:px-0 py-8">
        
        {/* Form content wrapper */}
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          {/* Logo */}
          <div className="mb-16">
            <img src={logo} alt="Logo" className="w-28 sm:w-36 md:w-40 h-auto" />
          </div>

          {/* Form content */}
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default FormLayout;