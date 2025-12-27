import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const GridMotion = ({ items = [], gradientColor = 'black' }) => {
    const gridRef = useRef(null);
    const rowRefs = useRef([]);
    const mouseXRef = useRef(window.innerWidth / 2);
    const [columnCount, setColumnCount] = useState(7); // Default to desktop (7 columns)

    // Ensure we have enough items to fill the grid
    const totalItems = 4 * columnCount;
    const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
    const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

    // Handle resize to update column count
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setColumnCount(3); // Mobile
            } else {
                setColumnCount(7); // Desktop
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
            const maxScroll = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
            const scrollFraction = maxScroll > 0 ? scrollY / maxScroll : 0;
            mouseXRef.current = scrollFraction * window.innerWidth;
        };

        const updateMotion = () => {
            const maxMoveAmount = columnCount === 3 ? 200 : 600; // Reduced for mobile
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

        // Add listeners
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            removeAnimationLoop();
        };
    }, [columnCount]); // Re-run if column count changes

    return (
        <div ref={gridRef} className="h-full w-full overflow-hidden">
            <section
                className="w-full h-screen overflow-hidden relative flex items-center justify-center"
            >
                <div className={`flex-none relative h-[150vh] grid grid-rows-4 grid-cols-1 rotate-[-15deg] origin-center z-[2] ${columnCount === 3 ? 'w-[120vw] gap-3' : 'w-[150vw] gap-6'}`}>
                    {[...Array(4)].map((_, rowIndex) => (
                        <div
                            key={rowIndex}
                            className={`grid ${columnCount === 3 ? 'grid-cols-3 gap-3' : 'grid-cols-7 gap-6'}`}
                            style={{ willChange: 'transform, filter' }}
                            ref={el => (rowRefs.current[rowIndex] = el)}
                        >
                            {[...Array(columnCount)].map((_, itemIndex) => {
                                const content = combinedItems[rowIndex * columnCount + itemIndex];
                                return (
                                    <div key={itemIndex} className="relative">
                                        <div className="relative w-full h-full overflow-hidden rounded-[10px] bg-transparent flex items-center justify-center text-white text-[1.5rem]">
                                            {typeof content === 'string' ? (
                                                <img
                                                    src={content}
                                                    alt="Grid Item"
                                                    className="w-full h-full object-cover absolute top-0 left-0"
                                                    loading="lazy"
                                                />
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
