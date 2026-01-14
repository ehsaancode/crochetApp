import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import lighthouseAnim from '../../assets/newLottie/lighthouse news.lottie';

export default function DarkVeil() {
    return (
        <div className="w-full h-full relative overflow-hidden bg-silk-100 dark:bg-black">
            <DotLottieReact
                src={lighthouseAnim}
                loop
                autoplay
                // speed={0.4}
                mode="bounce"
                className="w-full h-full absolute inset-0 sepia-[.70] hue-rotate-[15deg] saturate-[.8] dark:filter-none scale-105 rotate-180"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Optional overlay to maintain the 'veil' effect if desired for contrast */}
            <div className="absolute inset-0 bg-black/5 dark:bg-black/20 pointer-events-none" />

            {/* Bottom blend gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-silk-100 to-transparent dark:from-black dark:to-transparent pointer-events-none" />


        </div>
    );
}
