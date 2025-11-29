import { useIntersectionObserver } from './useIntersectionObserver';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { targetRef, isIntersecting, hasIntersected } = useIntersectionObserver({
    threshold: options.threshold || 0.1,
    rootMargin: options.rootMargin || '-50px',
    triggerOnce: options.triggerOnce ?? true,
  });

  const shouldAnimate = isIntersecting || hasIntersected;

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: shouldAnimate ? { opacity: 1 } : { opacity: 0 },
    transition: { duration: 0.8 },
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: shouldAnimate ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 },
    transition: { duration: 0.7, ease: 'easeOut' },
  };

  const slideInRight = {
    initial: { opacity: 0, x: 50 },
    animate: shouldAnimate ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 },
    transition: { duration: 0.7, ease: 'easeOut' },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: shouldAnimate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 },
    transition: { duration: 0.6 },
  };

  return {
    ref: targetRef,
    isVisible: shouldAnimate,
    fadeInUp,
    fadeIn,
    slideInLeft,
    slideInRight,
    scaleIn,
  };
};