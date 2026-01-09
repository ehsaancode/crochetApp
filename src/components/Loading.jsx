import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { preloadAsset } from '../utils/animationCache';
import catAnimationUrl from '../pages/uiComponents/lottie/Cat playing with yarn.lottie';

const Loading = ({ className = "min-h-[50vh]" }) => {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        preloadAsset(catAnimationUrl).then(setAnimationData);
    }, []);

    if (!animationData) return null;

    return (
        <div className={`flex flex-col justify-center items-center w-full ${className}`}>
            <div className="w-32 h-32 sm:w-64 sm:h-64">
                <DotLottieReact
                    data={animationData}
                    loop
                    autoplay
                />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium pl-5 animate-pulse">Loading...</p>
        </div>
    );
};

export default Loading;
