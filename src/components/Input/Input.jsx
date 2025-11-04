import React, { useId } from "react";
import eyeOpen from "../../assets/eye.png";
import eyeClose from "../../assets/eyeclose.png";

const Input = ({
  type = "text",
  label,
  value,
  onChange,
  placeholder,
  icon,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  error,
  name,
  onFocus,
  onBlur,
}) => {
  const uniqueId = useId();
  const inputId = `${name}-${uniqueId}`;

  return (
    <div className="mb-5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-gray-800 font-medium mb-2 text-sm sm:text-base"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <img
            src={icon}
            alt="icon"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-70"
          />
        )}

        <input
          id={inputId}
          name={name}
          type={
            type === "password" && showPasswordToggle
              ? showPassword
                ? "text"
                : "password"
              : type
          }
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full border rounded-md p-3 pl-10 pr-10 focus:outline-none focus:ring-2 text-black placeholder-gray-500 ${
            error
              ? "border-red-500 ring-red-400"
              : "border-gray-300 focus:ring-blue-400"
          }`}
        />

        {showPasswordToggle && (
          <img
            src={showPassword ? eyeOpen : eyeClose}
            alt="toggle"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer opacity-70"
            onClick={onTogglePassword}
          />
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default Input;