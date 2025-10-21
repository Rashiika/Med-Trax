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
}) => {
  return (
    <div className="flex flex-col mb-4">
      {/* Label */}
      <label className="text-gray-700 font-medium mb-1">
        {label}{" "}
        {required ? (
          <span className="text-red-500">*</span>
        ) : (
          <span className="text-gray-400 text-sm">(optional)</span>
        )}
      </label>

      {/* Input or Select */}
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
};

export default DetailsInput;
