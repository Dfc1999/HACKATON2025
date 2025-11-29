import React, { useRef, useState, useEffect } from 'react';
import Button from './Button.js';
import LoadingSpinner from './LoadingSpinner.js';

interface CameraCaptureProps {
  onCapture: (photo: string, vector: Float32Array) => void;
  onCancel: () => void;
  showGuidelines?: boolean ;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onCancel,
  showGuidelines = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsLoading(false);
        };
      }
    } catch (err) {
      setError('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(imageData);
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      // Simulación de vector facial generado (en producción se obtendría del servicio de reconocimiento)
      const simulatedVector = new Float32Array(128).map(() => Math.random());
      onCapture(capturedImage, simulatedVector);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-red-50 rounded-2xl min-h-[400px]">
        <svg
          className="w-16 h-16 text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-red-700 text-center mb-6 text-sm sm:text-base">{error}</p>
        <Button variant="primary" onClick={onCancel}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative w-full aspect-[3/4] sm:aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner message="Iniciando cámara..." />
          </div>
        )}

        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {showGuidelines && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-48 h-64 sm:w-64 sm:h-80">
                  <div className="absolute inset-0 border-4 border-cyan-400 rounded-full opacity-50 animate-pulse" />
                  <div className="absolute inset-4 border-2 border-white rounded-full" />
                  
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <p className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">
                      Centra tu rostro
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <img
            src={capturedImage}
            alt="Foto capturada"
            className="w-full h-full object-cover"
          />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {!capturedImage ? (
          <>
            <Button
              variant="ghost"
              onClick={onCancel}
              fullWidth
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={capturePhoto}
              disabled={isLoading}
              fullWidth
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            >
              Capturar
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              onClick={retakePhoto}
              fullWidth
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            >
              Retomar
            </Button>
            <Button
              variant="primary"
              onClick={confirmPhoto}
              fullWidth
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
            >
              Confirmar
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;