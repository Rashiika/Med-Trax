import React from "react";
import logo from "../../assets/logo.png";

const DetailFormLayout = ({ title, steps, activeStep, setActiveStep, children }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      <div className="w-full bg-blue-50 p-4 flex flex-col items-center 
                     lg:w-[31.875rem] lg:h-screen lg:sticky lg:top-0 lg:p-8 lg:rounded-lg lg:my-6 lg:ml-6">
        
        <img src={logo} alt="Logo" className="w-28 lg:w-[9.125rem] mb-6" />

        <div className="flex flex-row justify-around w-full lg:flex-col lg:space-y-[5.25rem] lg:mt-4">
          {steps.map((step, index) => {
            const isActive = index === activeStep;

            return (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`flex flex-col items-center p-2 rounded-lg transition duration-200 
                           lg:flex-row lg:w-full lg:py-2 lg:px-3 
                           ${isActive ? "lg:bg-green-100" : "lg:hover:bg-blue-100"}`}
              >
                <div
                  className={`w-10 h-10 text-xl flex items-center justify-center rounded-full font-semibold transition duration-200 
                             lg:w-[3.5rem] lg:h-[3.5rem] lg:text-[1.75rem] lg:mr-3
                             ${isActive ? "bg-green-500 text-white" : "bg-[#E9E6E6] text-[#8E98A8]"}`}
                >
                  {index + 1}
                </div>

                <p
                  className={`hidden text-center transition duration-200 
                             lg:block lg:text-left lg:text-[1.75rem]
                             ${isActive ? "text-green-600 font-semibold" : "text-[#8E98A8]"}`}
                >
                  {step}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 bg-white p-6 lg:p-10 rounded-t-2xl -mt-4 z-10 lg:rounded-none lg:mt-0 shadow-lg lg:shadow-none">
        <h2 className="text-2xl font-semibold text-[#2A87D7] mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default DetailFormLayout;
