import React from "react";

// CSS to prevent autofill styling while preserving focus ring
const autofillStyles = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: black !important;
    background-color: white !important;
    background-image: none !important;
  }
  
  input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 30px white inset, 0 0 0 2px #3B82F6 !important;
    -webkit-text-fill-color: black !important;
    background-color: white !important;
    background-image: none !important;
  }
  
  input:-moz-autofill,
  input:-moz-autofill:hover {
    background-color: white !important;
    background-image: none !important;
  }
  
  input:-moz-autofill:focus {
    background-color: white !important;
    background-image: none !important;
    box-shadow: 0 0 0 2px #3B82F6;
  }
`;

const DetailsInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  options,
  required = false,
  error = "",
  disabled = false,
}) => {
  return (
    <div className="flex flex-col mb-4">
      <style>{autofillStyles}</style>
      <label className="text-gray-700 font-medium mb-1">
        {label}{" "}
        {required ? (
          <span className="text-red-500">*</span>
        ) : (
          <span className="text-gray-400 text-sm">(optional)</span>
        )}
      </label>

      {type === "select" ? (
        <select
  name={name}
  value={value}
  onChange={onChange}
  required={required}
  disabled={disabled}
  className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white ${
    error
      ? "border-red-500 focus:!ring-red-500 focus:!border-red-500"
      : "border-gray-300"
  } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
>
          <option value="" disabled hidden>
            Select
          </option>
          {options?.map((opt, idx) => (
            <option
              key={idx}
              value={typeof opt === "string" ? opt : opt.value}
            >
              {typeof opt === "string" ? opt : opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
  type={type}
  name={name}
  value={value}
  onChange={onChange}
  placeholder={placeholder}
  required={required}
  disabled={disabled}
  className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white ${
    error
      ? "border-red-500 focus:!ring-red-500 focus:!border-red-500"
      : "border-gray-300"
  } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
  style={{
    WebkitBoxShadow: "0 0 0 1000px white inset",
    WebkitTextFillColor: "black",
    backgroundColor: "white"
  }}
  autoComplete="off"
/>
      )}

      {error && (
        <span className="text-red-500 text-sm mt-1">{error}</span>
      )}
    </div>
  );
};

export default DetailsInput;