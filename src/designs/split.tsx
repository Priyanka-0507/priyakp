import { useSprings, animated } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';

// Define prop types
interface SplitTextProps {
  text?: string;
  className?: string;
  delay?: number;
  animationFrom?: object;
  animationTo?: object;
  easing?: (t: number) => number; // TypeScript expects an easing function
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'right' | 'center' | 'justify' | 'start' | 'end'; // Valid textAlign values
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text = '',
  className = '',
  delay = 100,
  animationFrom = { opacity: 0, transform: 'translate3d(0,40px,0)' },
  animationTo = { opacity: 1, transform: 'translate3d(0,0,0)' },
  easing = (t) => t, // Default linear easing function
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  onLetterAnimationComplete,
}) => {
  const words = text.split(' ').map(word => word.split(''));
  const letters = words.flat();
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement | null>(null); // ✅ Add explicit type
  const animatedCount = useRef(0);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const springs = useSprings(letters.length, 
    letters.map((_, i) => ({
      from: animationFrom,
      to: async (next: any) => { // Fix: Explicitly type `next`
        await next(animationTo);
        animatedCount.current += 1;
        if (animatedCount.current === letters.length && onLetterAnimationComplete) {
          onLetterAnimationComplete();
        }
      },
      delay: i * delay,
      config: { easing },
    }))
  );
  

  return (
    <p
      ref={ref}
      className={`split-parent overflow-hidden inline ${className}`}
      style={{ textAlign, whiteSpace: 'normal', wordWrap: 'break-word' }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.map((letter, letterIndex) => {
            const index = words
              .slice(0, wordIndex)
              .reduce((acc, w) => acc + w.length, 0) + letterIndex;

            return (
              <animated.span
                key={index}
                style={springs[index]}
                className="inline-block transform transition-opacity will-change-transform"
              >
                {letter}
              </animated.span>
            );
          })}
          <span style={{ display: 'inline-block', width: '0.3em' }}>&nbsp;</span>
        </span>
      ))}
    </p>
  );
};

export default SplitText;
