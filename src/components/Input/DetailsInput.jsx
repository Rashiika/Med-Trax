import React from "react";

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
  className={`border rounded-md p-2 focus:outline-none focus:ring-2 transition-all ${
    error
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:ring-blue-500"
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
  className={`border rounded-md p-2 focus:outline-none focus:ring-2 transition-all ${
    error
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:ring-blue-500"
  } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
/>
      )}

      {error && (
        <span className="text-red-500 text-sm mt-1">{error}</span>
      )}
    </div>
  );
};

export default DetailsInput;