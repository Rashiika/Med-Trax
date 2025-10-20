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
                 <div className="absolute top-8 left-0 right-0 flex justify-center z-10">
                     <img src={logo} alt="Logo" className="w-40 h-auto"/>
                 </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-center">
                <div className="relative w-full md:hidden">
                    <div className="absolute top-0 left-0 w-full flex justify-center pt-8 z-10">
                        <img src={logo} alt="Med-Trax" className="h-16 w-auto" />
                    </div>
                    <div className="w-full h-64">
                        <img
                            src={hospitalImg}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                 <div className="hidden md:flex justify-center pt-12 pb-8">
                     <img src={logo} alt="Med-Trax" className="h-16 w-auto" />
                 </div>

                <div className="relative w-full max-w-md px-4 md:px-0 md:flex md:flex-col md:justify-center md:flex-grow">
                    <div className="bg-white rounded-lg shadow-xl p-8 -mt-24 z-20 md:mt-0 md:shadow-none md:bg-transparent md:p-0 md:z-0">
                        {children}
                    </div>
                </div>
                 <div className="pb-12 md:hidden"></div>
            </div>
        </div>
    );
};

export default FormLayout;