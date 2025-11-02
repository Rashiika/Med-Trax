import React from "react";
import { useNavigate } from "react-router-dom";
import hospitalImg from "../../assets/hospital.png";
import logo from "../../assets/logo.png";

const FormLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-white font-[Inter]">
      <div className="hidden md:block md:w-1/2 h-full relative">
        <img
          src={hospitalImg}
          alt="Hospital"
          className="w-full h-full object-cover rounded-none md:rounded-r-[100px]"
        />
      </div>

      <div className="hidden md:flex md:w-1/2 flex-col justify-center px-4 sm:px-8 py-8 overflow-y-auto">
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          <div className="mb-16">
            <img
              src={logo}
              alt="Logo"
              className="w-28 sm:w-36 md:w-40 h-auto"
            />
          </div>
          <div className="w-full">
            {children}
            <p
              className="text-center text-sm mt-4"
              style={{ color: "#000000" }}
            >
              Go back to{" "}
              <button
                onClick={() => navigate("/")}
                className="text-blue-600 hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
              >
                Role
              </button>
            </p>
          </div>
        </div>
      </div>


      <div className="md:hidden relative w-full h-screen overflow-hidden bg-white">
        <div
          className="absolute top-0 left-0 w-full"
          style={{ height: "65vh" }}
        >
          <img
            src={hospitalImg}
            alt="Hospital"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="absolute top-4 left-0 right-0 z-20 flex justify-center">
          <img src={logo} alt="Logo" className="w-32 h-auto" />
        </div>

        <div
          className="absolute left-1/2 transform -translate-x-1/2 z-10"
          style={{ top: "49vh", width: "320px" }}
        >
          <div
            className="bg-white shadow-lg overflow-y-auto"
            style={{
              borderRadius: "5.76px",
              padding: "14px 18px",
              maxHeight: "48vh",
            }}
          >
            {children}
            <p
              className="text-center text-sm -mt-1"
              style={{ color: "#000000" }}
            >
              Go back to{" "}
              <button
                onClick={() => navigate("/")}
                className="text-blue-600 hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
              >
                Role
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLayout;
