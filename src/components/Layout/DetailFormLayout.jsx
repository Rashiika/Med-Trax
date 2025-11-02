import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";

const DetailFormLayout = ({ title, steps, children, formData, sectionFields, onSubmit, loading, errors = {} }) => {
  const [activeStep, setActiveStep] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActiveStep(index);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const handleStepClick = (index) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setShowSidebar(false);
  };

  const isSectionCompleted = (section) => {
    const fields = sectionFields[section];
    if (!fields || fields.length === 0) {
      return false;
    }
    return fields.every((field) => {
      const fieldValue = formData[field];
      const hasValue = fieldValue && fieldValue.toString().trim() !== "";
      const hasNoError = !errors[field];
      return hasValue && hasNoError;
    });
  };

  const areAllRequiredFieldsFilled = () => {
    const allRequiredFields = Object.values(sectionFields).flat();
    return allRequiredFields.every((field) => {
      const fieldValue = formData[field];
      const hasValue = fieldValue && fieldValue.toString().trim() !== "";
      const hasNoError = !errors[field];
      return hasValue && hasNoError;
    });
  };

  const isProceedEnabled = areAllRequiredFieldsFilled();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white overflow-hidden">
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {showSidebar ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {showSidebar && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-40
          md:w-[30%] w-[80%] max-w-[300px]
          bg-blue-50 p-4 md:p-6
          flex flex-col items-center rounded-r-lg
          overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <img src={logo} alt="Logo" className="w-[7rem] md:w-[9rem] mb-6 md:mb-8" />

        <div className="w-full space-y-6 md:space-y-8">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = isSectionCompleted(step);

            return (
              <div
                key={index}
                onClick={() => handleStepClick(index)}
                className={`flex items-center space-x-3 cursor-pointer transition duration-200 ${
                  isActive ? "bg-blue-100 rounded-lg p-2" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border-2 transition-all flex-shrink-0 ${
                    isCompleted
                      ? "bg-green-500 text-white border-green-500"
                      : isActive
                      ? "bg-blue-500 text-white border-blue-500"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>
                <p
                  className={`text-sm md:text-lg ${
                    isCompleted
                      ? "text-green-600 font-semibold"
                      : isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  {step}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 md:w-[70%] h-screen overflow-y-auto px-4 md:px-6 relative">
        <div className="sticky top-0 bg-white z-20 border-b border-gray-300 pb-4 pt-16 md:pt-5">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-3">
            <h2 className="text-xl md:text-2xl font-semibold text-[#2A87D7] text-center md:text-left">{title}</h2>
            <button
              onClick={onSubmit}
              disabled={!isProceedEnabled || loading}
              className={`hidden md:block px-6 py-2 rounded-lg font-semibold transition-all ${
                isProceedEnabled && !loading
                  ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? "Processing..." : "Proceed"}
            </button>
          </div>
        </div>

        <div className="mt-6">
          {React.Children.map(children, (child, index) =>
            React.cloneElement(child, {
              ref: (el) => (sectionRefs.current[index] = el),
              "data-index": index,
            })
          )}
        </div>

        <div className="md:hidden mt-8 mb-6">
          <button
            onClick={onSubmit}
            disabled={!isProceedEnabled || loading}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
              isProceedEnabled && !loading
                ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : "Proceed"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailFormLayout;