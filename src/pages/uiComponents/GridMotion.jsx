import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const GridMotion = ({ items = [], gradientColor = 'black' }) => {
    const gridRef = useRef(null);
    const rowRefs = useRef([]);
    const mouseXRef = useRef(window.innerWidth / 2);
    const [columnCount, setColumnCount] = useState(7); // Default to desktop

    // Determine row count based on column count (Mobile = 12 cols -> 7 rows, Desktop = 7 cols -> 4 rows)
    const rowCount = columnCount > 6 ? 5 : 9;

    // Ensure we have enough items to fill the grid (or at least defaults)
    // We will use modulo to repeat items so totalItems is just for generating defaults if needed
    const totalItems = rowCount * columnCount;
    const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
    const combinedItems = items.length > 0 ? items : defaultItems;

    // Handle resize to update column count
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setColumnCount(6); // Mobile: Reduce columns to increase width
            } else {
                setColumnCount(7); // Desktop: Maintain specific user preference
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
            // Use a sine wave to create continuous, smooth motion as you scroll
            // This decouples the movement from the total page height, ensuring activity
            // even on long pages or short viewports.
            // 0.002 controls the frequency of the wave (speed of oscillation relative to scroll)
            const oscillation = Math.sin(scrollY * 0.002);
            // Map -1..1 to 0..window.innerWidth
            mouseXRef.current = ((oscillation + 1) / 2) * window.innerWidth;
        };

        const updateMotion = () => {
            const isMobile = columnCount !== 7;
            const maxMoveAmount = isMobile ? 300 : 600;
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
        window.addEventListener('scroll', handleScroll, { passive: true });

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
                {/* Dynamically adjust width and gap based on device/columnCount */}
                <div className={`flex-none relative h-[150vh] grid grid-cols-1 rotate-[-15deg] origin-center z-[2] ${columnCount !== 7 ? 'w-[200vw] gap-2' : 'w-[150vw] gap-6'}`}
                    style={{ gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))` }}
                >
                    {[...Array(rowCount)].map((_, rowIndex) => (
                        <div
                            key={rowIndex}
                            className={`grid w-full h-full ${columnCount !== 7 ? 'gap-2' : 'gap-6'}`}
                            style={{
                                willChange: 'transform, filter',
                                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`
                            }}
                            ref={el => (rowRefs.current[rowIndex] = el)}
                        >
                            {[...Array(columnCount)].map((_, itemIndex) => {
                                const content = combinedItems[(rowIndex * columnCount + itemIndex) % combinedItems.length];
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
