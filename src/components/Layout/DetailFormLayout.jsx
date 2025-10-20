// src/components/Layout/DetailFormLayout.jsx
import React from "react";
import logo from "../../assets/logo.png";

const DetailFormLayout = ({ title, steps, activeStep, setActiveStep, children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Left Sidebar */}
      <div className="my-[1.62rem] ml-[2.31rem] w-[31.875rem] bg-blue-50 p-6 flex flex-col items-center rounded-lg">
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-[9.125rem] mb-4" />

        {/* Steps */}
        <div className="w-full space-y-[5.25rem]">
          {steps.map((step, index) => {
            const isActive = index === activeStep;

            return (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`flex items-center w-full rounded-lg py-2 px-3 cursor-pointer transition duration-200 ${
                  isActive ? "bg-green-100" : "hover:bg-blue-100"
                }`}
              >
                <div
                  className={`w-[3.5rem] h-[3.5rem] flex items-center justify-center rounded-full mr-3 text-[1.75rem] font-semibold transition duration-200 ${
                    isActive
                      ? "bg-green-500 text-white"
                      : "bg-[#E9E6E6] text-[#8E98A8]"
                  }`}
                >
                  {index + 1}
                </div>

                <p
                  className={`text-[1.75rem] text-left transition duration-200 ${
                    isActive
                      ? "text-green-600 font-semibold"
                      : "text-[#8E98A8]"
                  }`}
                >
                  {step}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Form Area */}
      <div className="flex-1 bg-white p-6 md:p-10 rounded-t-2xl md:rounded-none shadow-sm">
        <h2 className="text-2xl font-semibold text-[#2A87D7] mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default DetailFormLayout;
