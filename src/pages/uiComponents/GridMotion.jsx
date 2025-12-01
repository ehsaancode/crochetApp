import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const GridMotion = ({ items = [], gradientColor = 'black' }) => {
    const gridRef = useRef(null);
    const rowRefs = useRef([]);
    const mouseXRef = useRef(window.innerWidth / 2);
    const [columnCount, setColumnCount] = useState(4); // Default to desktop

    // Ensure we have enough items to fill the grid
    const totalItems = 4 * columnCount;
    const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
    const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

    // Handle resize to update column count
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setColumnCount(2); // Mobile
            } else {
                setColumnCount(4); // Desktop
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        gsap.ticker.lagSmoothing(0);

        const handleMouseMove = (e) => {
            mouseXRef.current = e.clientX;
        };

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const scrollFraction = maxScroll > 0 ? scrollY / maxScroll : 0;
            mouseXRef.current = scrollFraction * window.innerWidth;
        };

        const updateMotion = () => {
            const maxMoveAmount = 800;
            const baseDuration = 0.8;
            const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

            rowRefs.current.forEach((row, index) => {
                if (row) {
                    const direction = index % 2 === 0 ? 1 : -1;
                    const moveAmount = ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction;

                    gsap.to(row, {
                        x: moveAmount,
                        duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
                        ease: 'power3.out',
                        overwrite: 'auto'
                    });
                }
            });
        };

        const removeAnimationLoop = gsap.ticker.add(updateMotion);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            removeAnimationLoop();
        };
    }, [columnCount]); // Re-run if column count changes (though logic is largely independent)

    return (
        <div ref={gridRef} className="h-full w-full overflow-hidden">
            <section
                className="w-full h-screen overflow-hidden relative flex items-center justify-center"
            // Background removed as requested
            >
                {/* Background pattern removed or kept subtle if needed, but user asked to remove background */}
                {/* <div className="absolute inset-0 pointer-events-none z-[4] bg-[length:250px]"></div> */}

                <div className="gap-6 flex-none relative w-[150vw] h-[150vh] grid grid-rows-4 grid-cols-1 rotate-[-15deg] origin-center z-[2]">
                    {[...Array(4)].map((_, rowIndex) => (
                        <div
                            key={rowIndex}
                            className={`grid gap-6 ${columnCount === 2 ? 'grid-cols-2' : 'grid-cols-4'}`}
                            style={{ willChange: 'transform, filter' }}
                            ref={el => (rowRefs.current[rowIndex] = el)}
                        >
                            {[...Array(columnCount)].map((_, itemIndex) => {
                                const content = combinedItems[rowIndex * columnCount + itemIndex];
                                return (
                                    <div key={itemIndex} className="relative">
                                        <div className="relative w-full h-full overflow-hidden rounded-[10px] bg-transparent flex items-center justify-center text-white text-[1.5rem]">
                                            {/* Handle both string URLs and imported image paths */}
                                            {typeof content === 'string' ? (
                                                <div
                                                    className="w-full h-full bg-cover bg-center absolute top-0 left-0"
                                                    style={{ backgroundImage: `url(${content})` }}
                                                ></div>
                                            ) : (
                                                <div className="p-4 text-center z-[1]">{content}</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default GridMotion;
