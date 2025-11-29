import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCarouselImages } from '../../../../../services/MockCarouselService';
import { useCarouselStore } from '../../../stores/carouselStore';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { ErrorMessage } from '../../common/ErrorMessage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroCarousel = () => {
  const [images, setImages] = useState<{ imageUrl: string; altText: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentIndex, isAutoPlaying, nextSlide, goToSlide, setImages: setStoreImages, images: storeImages } = useCarouselStore();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    getCarouselImages()
      .then((data) => {
        // Adaptar al nuevo formato del mock
        const formatted = data.map((item) => ({
          imageUrl: item.imageUrl,
          altText: item.title || 'Imagen del carrusel',
        }));
        setImages(formatted);
        setStoreImages(formatted);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Error al cargar imágenes del mock');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isAutoPlaying && images.length > 0) {
      intervalRef.current = window.setInterval(() => {
        nextSlide();
      }, 15000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isAutoPlaying, images.length, nextSlide]);

  if (isLoading) {
    return (
      <div style={{
        width: '100%',
        height: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2e0527'
      }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        width: '100%',
        height: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2e0527'
      }}>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (images.length === 0) return null;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '60vh',
      overflow: 'hidden',
      backgroundColor: '#2e0527'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 1.2, ease: 'easeInOut' },
            scale: { duration: 15, ease: 'linear' }
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          {storeImages.length > 0 && (
            <>
              <img
                src={storeImages[currentIndex % storeImages.length].imageUrl}
                alt={storeImages[currentIndex % storeImages.length].altText}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(46, 5, 39, 0.6) 100%)'
              }} />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => nextSlide()}
        style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(46, 5, 39, 0.2)',
          backdropFilter: 'blur(8px)',
          borderRadius: '50%',
          color: '#ffffff',
          border: '1px solid rgba(243, 255, 210, 0.2)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '24px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(46, 5, 39, 0.4)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          e.currentTarget.style.borderColor = 'rgba(243, 255, 210, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(46, 5, 39, 0.2)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          e.currentTarget.style.borderColor = 'rgba(243, 255, 210, 0.2)';
        }}
      >
        <ChevronRight style={{ width: '24px', height: '24px' }} />
      </button>

      <button
        onClick={() => goToSlide((currentIndex - 1 + images.length) % images.length)}
        style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(46, 5, 39, 0.2)',
          backdropFilter: 'blur(8px)',
          borderRadius: '50%',
          color: '#ffffff',
          border: '1px solid rgba(243, 255, 210, 0.2)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '24px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(46, 5, 39, 0.4)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          e.currentTarget.style.borderColor = 'rgba(243, 255, 210, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(46, 5, 39, 0.2)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          e.currentTarget.style.borderColor = 'rgba(243, 255, 210, 0.2)';
        }}
      >
        <ChevronLeft style={{ width: '24px', height: '24px' }} />
      </button>

      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 30,
        display: 'flex',
        gap: '12px'
      }}>
        {images.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                height: '8px',
                borderRadius: '4px',
                transition: 'all 0.3s ease',
                backgroundColor: isActive ? '#f3ffd2' : 'rgba(255, 255, 255, 0.4)',
                width: isActive ? '32px' : '12px',
                cursor: 'pointer',
                border: 'none',
                boxShadow: isActive ? '0 4px 12px rgba(243, 255, 210, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                  e.currentTarget.style.transform = 'scale(1.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};
