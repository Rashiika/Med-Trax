import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";

const DetailFormLayout = ({ title, steps, children, formData, sectionFields, onSubmit, loading }) => {
  const [activeStep, setActiveStep] = useState(null);
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
  };

  const isSectionCompleted = (section) => {
    const fields = sectionFields[section];
    if (!fields || fields.length === 0) {
      return false;
    }
    return fields.every((field) => {
      const fieldValue = formData[field];
      return fieldValue && fieldValue.toString().trim() !== "";
    });
  };

  const areAllRequiredFieldsFilled = () => {
    const allRequiredFields = Object.values(sectionFields).flat();
    return allRequiredFields.every((field) => {
      const fieldValue = formData[field];
      return fieldValue && fieldValue.toString().trim() !== "";
    });
  };

  const isProceedEnabled = areAllRequiredFieldsFilled();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white overflow-hidden">
      <div className="md:w-[30%] bg-blue-50 p-6 flex flex-col items-center rounded-r-lg overflow-y-auto">
        <img src={logo} alt="Logo" className="w-[9rem] mb-8" />

        <div className="w-full space-y-8">
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
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${
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
                  className={`text-lg ${
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

      <div className="md:w-[70%] h-screen overflow-y-scroll [&::-webkit-scrollbar]:hidden m-5 relative">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-300 pb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-[#2A87D7]">{title}</h2>
            <button
              onClick={onSubmit}
              disabled={!isProceedEnabled || loading}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
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
      </div>
    </div>
  );
};

export default DetailFormLayout;