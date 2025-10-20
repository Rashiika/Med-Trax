import React from 'react';
import logo from '../../assets/logo.png';
import hospitalImg from '../../assets/hospital.png';
const FormLayout = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-white md:flex md:flex-row font-[Inter]">
            
            <div className="hidden md:block md:w-1/2 md:h-screen md:sticky md:top-0">
                <img
                    src={hospitalImg}
                    alt="Hospital Background"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center bg-gray-100 md:bg-white">

                <div className="relative w-full md:hidden">
                    <div className="absolute top-0 left-0 w-full flex justify-center pt-8 z-10">
                        <img src={logo} alt="Med-Trax" className="h-16 w-auto" />
                    </div>
                    <div className="w-full h-64 sm:h-80">
                        <img
                            src={hospitalImg}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="hidden md:flex justify-center pt-12 pb-8">
                    <img src={logo} alt="Med-Trax" className="h-20 w-auto" />
                </div>
                
                <div className="w-full flex-grow flex justify-center px-4 md:px-8">
                    <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 -mt-24 z-20 md:shadow-none md:mt-0 md:bg-transparent md:p-0">
                        {children}
                    </div>
                </div>

                <div className="pb-12 md:hidden"></div>
            </div>
        </div>
    );
};

export default FormLayout;
