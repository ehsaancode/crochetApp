import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

const UploadProgressPopup = ({ isOpen, isSuccess, onClose, message }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;
        if (isOpen && !isSuccess) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return prev; // Hold at 90% until success
                    return prev + 10;
                });
            }, 500);
        } else if (isSuccess) {
            setProgress(100);
            // Optionally close automatically after some time, but typically handled by parent
        }
        return () => clearInterval(interval);
    }, [isOpen, isSuccess]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center min-w-[300px] transform transition-all scale-100">

                {!isSuccess ? (
                    <>
                        <div className="relative mb-4">
                            <div className="w-16 h-16 border-4 border-silk-100 dark:border-gray-700 rounded-full"></div>
                            <div
                                className="absolute top-0 left-0 w-16 h-16 border-4 border-silk-500 border-t-transparent rounded-full animate-spin"
                            ></div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Uploading Product</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Please wait while we process your request...</p>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1 overflow-hidden">
                            <div
                                className="bg-silk-600 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-400 text-right w-full">{progress}%</p>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 animate-bounce-subtle">
                            <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={3} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Success!</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center">Product has been added successfully.</p>
                    </>
                )}

            </div>
        </div>
    );
};

export default UploadProgressPopup;
