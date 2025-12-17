import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const toastEvents = {
    listeners: [],
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    },
    emit(event) {
        this.listeners.forEach((listener) => listener(event));
    },
};

const PRESETS = {
    success: {
        bg: "bg-green-200",
        text: "text-green-600",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
        ),
    },
    error: {
        bg: "bg-red-200",
        text: "text-red-600",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
    },
    info: {
        bg: "bg-blue-200",
        text: "text-blue-600",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    warning: {
        bg: "bg-yellow-200",
        text: "text-yellow-600",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    },
};

// Toast Item Component
const ToastItem = ({
    message = "Default Toast Message",
    duration = 3000,
    position = "top-right",
    type = "success",
    show = true,
    mode = "light",
    onClose,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    const expiryTimeRef = React.useRef(0);
    const timerRef = React.useRef(null);

    const stylePreset = PRESETS[type] || PRESETS.success;

    const handleShow = () => {
        setShouldRender(true);
        setTimeout(() => {
            setIsVisible(true);
        }, 10);
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            setShouldRender(false);
            if (onClose) onClose();
        }, 300);
    };

    const safeDuration = parseInt(duration, 10) || 3000;

    useEffect(() => {
        if (show) handleShow();
        else handleClose();
    }, [show]);

    useEffect(() => {
        if (isVisible && safeDuration) {
            expiryTimeRef.current = Date.now() + safeDuration;
            timerRef.current = setTimeout(handleClose, safeDuration);
        }
        return () => clearTimeout(timerRef.current);
    }, [isVisible, safeDuration]);

    const handleMouseEnter = () => clearTimeout(timerRef.current);

    const handleMouseLeave = () => {
        if (isVisible) {
            const remainingTime = expiryTimeRef.current - Date.now();
            if (remainingTime <= 0) handleClose();
            else timerRef.current = setTimeout(handleClose, remainingTime);
        }
    };

    const transitionClasses = "transition-all duration-300 ease-in-out transform";
    const visibleClasses = "opacity-100 scale-100 translate-x-0 translate-y-0";

    let hiddenClasses = "opacity-0";
    if (position.includes("left")) hiddenClasses += " -translate-x-10";
    else if (position.includes("right")) hiddenClasses += " translate-x-10";
    else if (position.includes("top")) hiddenClasses += " -translate-y-10";
    else if (position.includes("bottom")) hiddenClasses += " translate-y-10";
    else if (position === "center") hiddenClasses += " scale-50";

    const isDarkMode = mode === "dark";
    const themeClasses = isDarkMode
        ? "bg-gray-800 text-white shadow-black/50"
        : "bg-white text-black shadow-gray-500";

    if (!show && !shouldRender) return null;

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative flex items-center justify-between max-w-sm w-auto min-w-[300px] px-4 py-2 rounded-xl shadow-lg z-[9999] pointer-events-auto ${themeClasses} ${transitionClasses} ${isVisible ? visibleClasses : hiddenClasses}`}
        >
            <div className="flex items-center gap-3 overflow-hidden">

                {/*Icon Wrapper with shrink-0*/}
                <div
                    className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full ${stylePreset.bg} ${stylePreset.text} transition-transform duration-500 delay-100 ${isVisible ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`}
                >
                    {stylePreset.icon}
                </div>

                <span className="break-words text-sm">{message}</span>
            </div>
            <button
                onClick={handleClose}
                className={`rounded-full p-1 hover:transition hover:text-red-500 ${isDarkMode ? "text-gray-400" : "text-gray-900"}`}
            >
                ×
            </button>
        </div>
    );
};

// Toast Container
const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);
    const { theme } = useTheme();

    useEffect(() => {
        return toastEvents.subscribe((event) => {
            if (event.type === "ADD") {
                setToasts((prev) => [...prev, { ...event.payload, id: Date.now() + Math.random() }]);
            }
        });
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const groupedToasts = toasts.reduce((acc, toast) => {
        const pos = toast.position || "top-right";
        if (!acc[pos]) acc[pos] = [];
        acc[pos].push(toast);
        return acc;
    }, {});

    const positionStyles = {
        "top-left": "top-4 left-4 flex-col",
        "top-right": "top-4 right-4 flex-col",
        "bottom-left": "bottom-20 md:bottom-4 left-4 flex-col-reverse",
        "bottom-right": "bottom-20 md:bottom-4 right-4 flex-col-reverse",
        "top-center": "top-4 left-1/2 -translate-x-1/2 flex-col",
        "bottom-center": "bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse",
        "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col",
        "center-right": "top-1/2 right-4 -translate-y-1/2 flex-col",
        "center-left": "top-1/2 left-4 -translate-y-1/2 flex-col",
    };

    return (
        <>
            {Object.entries(groupedToasts).map(([pos, toastsInGroup]) => (
                <div
                    key={pos}
                    className={`fixed z-[9999] flex gap-3 pointer-events-none ${positionStyles[pos] || positionStyles["top-right"]}`}
                >
                    {toastsInGroup.map((toast) => (
                        <ToastItem
                            key={toast.id}
                            {...toast}
                            mode={theme}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </div>
            ))}
        </>
    );
};

// Main Export
const QToast = (props) => {
    return <ToastContainer {...props} />;
};

QToast.success = (message, options = {}) =>
    toastEvents.emit({ type: "ADD", payload: { message, type: "success", ...options } });

QToast.error = (message, options = {}) =>
    toastEvents.emit({ type: "ADD", payload: { message, type: "error", ...options } });

QToast.info = (message, options = {}) =>
    toastEvents.emit({ type: "ADD", payload: { message, type: "info", ...options } });

QToast.warning = (message, options = {}) =>
    toastEvents.emit({ type: "ADD", payload: { message, type: "warning", ...options } });


QToast.show = (message, options = {}) =>
    toastEvents.emit({ type: "ADD", payload: { message, ...options } });

export default QToast;