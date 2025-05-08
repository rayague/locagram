import { useEffect, useState, RefObject } from 'react';

export function useParallax<T extends HTMLElement>(depth: number = 0.2) {
  const [ref, setRef] = useState<RefObject<T> | null>(null);

  useEffect(() => {
    if (!ref?.current) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const element = ref.current;
      if (element) {
        // Apply parallax effect based on scroll position and depth
        const movement = scrollY * depth;
        element.style.transform = `translateY(${movement}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Initial calculation on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref, depth]);

  return { ref: setRef };
}
