import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Check if we are on the collection page
        if (pathname === '/collection') {
            // If we have a saved scroll position (from clicking a product), 
            // we don't scroll to top here. We let Collection.jsx (or browser) handle the restoration.
            const savedScrollY = sessionStorage.getItem('collectionScrollY');
            if (savedScrollY) {
                return;
            }
        }

        // For all other cases (or if no saved scroll position for collection), scroll to top
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
