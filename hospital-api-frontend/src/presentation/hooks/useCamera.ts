import { useState, useRef, useCallback } from 'react';

interface UseCameraReturn {
  hasPermission: boolean | null;
  isActive: boolean;
  stream: MediaStream | null;
  error: string | null;
  requestCameraPermission: () => Promise<boolean>;
  startCamera: (constraints?: MediaStreamConstraints) => Promise<void>;
  stopCamera: () => void;
  capturePhoto: () => string | null;
  switchCamera: () => Promise<void>;
}

const useCamera = (): UseCameraReturn => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      stream.getTracks().forEach(track => track.stop());
      
      setHasPermission(true);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      
      if (errorMessage.includes('Permission denied')) {
        setError('Permiso denegado. Por favor, permite el acceso a la cámara en la configuración.');
      } else if (errorMessage.includes('NotFoundError')) {
        setError('No se encontró ninguna cámara en el dispositivo.');
      } else {
        setError('Error al solicitar permisos de cámara.');
      }
      
      setHasPermission(false);
      return false;
    }
  }, []);

  const startCamera = useCallback(async (
    constraints?: MediaStreamConstraints
  ): Promise<void> => {
    try {
      setError(null);
      
      if (streamRef.current) {
        stopCamera();
      }

      const defaultConstraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: { ideal: 16 / 9 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        constraints || defaultConstraints
      );

      streamRef.current = stream;
      setIsActive(true);
      setHasPermission(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      
      if (errorMessage.includes('NotAllowedError')) {
        setError('Permiso denegado. Permite el acceso a la cámara.');
      } else if (errorMessage.includes('NotFoundError')) {
        setError('No se encontró cámara en el dispositivo.');
      } else if (errorMessage.includes('NotReadableError')) {
        setError('La cámara está siendo usada por otra aplicación.');
      } else {
        setError('Error al iniciar la cámara.');
      }
      
      setIsActive(false);
      setHasPermission(false);
      throw err;
    }
  }, [facingMode]);

  const stopCamera = useCallback((): void => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    
    setIsActive(false);
  }, []);

  const capturePhoto = useCallback((): string | null => {
    if (!streamRef.current) {
      setError('No hay stream de cámara activo.');
      return null;
    }

    try {
      const canvas = document.createElement('canvas');
      const video = document.createElement('video');
      video.srcObject = streamRef.current;

      return new Promise<string>((resolve) => {
        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const context = canvas.getContext('2d');
          if (!context) {
            setError('Error al crear contexto del canvas.');
            resolve('');
            return;
          }

          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const imageData = canvas.toDataURL('image/jpeg', 0.95);
          resolve(imageData);
        };
        
        video.play();
      }) as any;
    } catch (err) {
      setError('Error al capturar foto.');
      return null;
    }
  }, []);

  const switchCamera = useCallback(async (): Promise<void> => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    
    if (isActive) {
      stopCamera();
      await startCamera({
        video: {
          facingMode: newFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
    }
  }, [facingMode, isActive, startCamera, stopCamera]);

  return {
    hasPermission,
    isActive,
    stream: streamRef.current,
    error,
    requestCameraPermission,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
  };
};

export default useCamera;