import React, { useState, useEffect } from 'react';

interface SecureImageDisplayProps {
  imageUrl: string;
  blurLevel?: number;
  onExpire?: () => void;
  expirationMinutes?: number;
  showWatermark?: boolean;
}

const SecureImageDisplay: React.FC<SecureImageDisplayProps> = ({
  imageUrl,
  blurLevel = 0,
  onExpire,
  expirationMinutes = 20,
  showWatermark = true,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(expirationMinutes * 60);
  const [isExpired, setIsExpired] = useState(false);
  const [showImage, setShowImage] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          setShowImage(false);
          clearInterval(interval);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onExpire]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    if (timeRemaining > 600) return 'text-green-600';
    if (timeRemaining > 300) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isExpired) {
    return (
      <div className="relative w-full aspect-[3/4] sm:aspect-video bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="text-center p-6">
          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 text-gray-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <p className="text-gray-400 text-sm sm:text-base">
            Imagen expirada por seguridad
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative w-full aspect-[3/4] sm:aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        {showImage && (
          <img
            src={imageUrl}
            alt="Imagen confidencial"
            className={`w-full h-full object-cover ${
              blurLevel > 0 ? `blur-${blurLevel}` : ''
            }`}
            style={
              blurLevel > 0
                ? { filter: `blur(${blurLevel}px)` }
                : undefined
            }
          />
        )}

        {showWatermark && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white text-xs sm:text-sm font-bold tracking-wider">
                  CONFIDENCIAL
                </span>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none">
              <p className="text-white text-4xl sm:text-6xl md:text-8xl font-bold rotate-[-30deg] whitespace-nowrap">
                CONFIDENCIAL
              </p>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  timeRemaining <= 300 ? 'animate-pulse' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-white text-xs sm:text-sm font-medium">
                Expira en:
              </span>
            </div>
            <span
              className={`text-lg sm:text-xl font-bold tabular-nums ${getTimerColor()}`}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>

          <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                timeRemaining > 600
                  ? 'bg-green-500'
                  : timeRemaining > 300
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{
                width: `${(timeRemaining / (expirationMinutes * 60)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <p className="leading-tight">
          Esta imagen se eliminará automáticamente por seguridad
        </p>
      </div>
    </div>
  );
};

export default SecureImageDisplay;