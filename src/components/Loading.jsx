import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import catAnimation from '../pages/uiComponents/lottie/Cat playing with yarn.lottie';

const Loading = ({ className = "min-h-[50vh]" }) => {
    return (
        <div className={`flex flex-col justify-center items-center w-full ${className}`}>
            <div className="w-32 h-32 sm:w-64 sm:h-64">
                <DotLottieReact
                    src={catAnimation}
                    loop
                    autoplay
                />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium pl-5 animate-pulse">Loading...</p>
        </div>
    );
};

export default Loading;
