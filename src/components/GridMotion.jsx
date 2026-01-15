import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const GridMotion = ({ items = [], gradientColor = 'black' }) => {
  const gridRef = useRef(null);
  const rowRefs = useRef([]);
  const mouseXRef = useRef(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemsPerRow = isMobile ? 12 : 12; // Mobile: 12 items per row
  const rowCount = isMobile ? 7 : 4; // 7 rows on mobile, 4 on desktop
  const totalItems = rowCount * itemsPerRow;
  const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
  const combinedItems = items.length > 0 ? items : defaultItems;

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);

    const handleMouseMove = e => {
      mouseXRef.current = e.clientX;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const oscillation = Math.sin(scrollY * 0.002);
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
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      removeAnimationLoop();
    };
  }, [itemsPerRow]); // Re-run if itemsPerRow changes

  return (
    <div ref={gridRef} className="h-full w-full overflow-hidden">
      <section
        className="w-full h-screen overflow-hidden relative flex items-center justify-center"
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`
        }}
      >
        <div className="absolute inset-0 pointer-events-none z-[4] bg-[length:250px]"></div>
        <div className="gap-2 md:gap-4 flex-none relative w-[200vw] md:w-[150vw] h-[150vh] grid grid-cols-1 rotate-[-15deg] origin-center z-[2]"
          style={{ gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))` }}
        >
          {[...Array(rowCount)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className={`grid gap-2 md:gap-4 w-full h-full`}
              style={{
                willChange: 'transform, filter',
                gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))`
              }}
              ref={el => (rowRefs.current[rowIndex] = el)}
            >
              {[...Array(itemsPerRow)].map((_, itemIndex) => {
                const content = combinedItems[(rowIndex * itemsPerRow + itemIndex) % combinedItems.length];
                return (
                  <div key={itemIndex} className="relative">
                    <div className="relative w-full h-full overflow-hidden rounded-[10px] bg-[#111] flex items-center justify-center text-white text-[1.5rem]">
                      {typeof content === 'string' && content.startsWith('http') ? (
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
        <div className="relative w-full h-full top-0 left-0 pointer-events-none"></div>
      </section>
    </div>
  );
};

export default GridMotion;
