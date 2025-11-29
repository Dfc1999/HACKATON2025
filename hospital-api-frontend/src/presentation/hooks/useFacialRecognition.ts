import { useState, useCallback, useEffect } from 'react';

interface FaceQuality {
  score: number;
  isGoodQuality: boolean;
  issues: string[];
}

interface UseFacialRecognitionReturn {
  isReady: boolean;
  isProcessing: boolean;
  error: string | null;
  progress: number;
  initializeFaceAPI: () => Promise<void>;
  captureAndConvertToVector: (imageData: string) => Promise<Float32Array | null>;
  validateFaceQuality: (imageData: string) => Promise<FaceQuality>;
  detectFaces: (imageData: string) => Promise<number>;
}

const useFacialRecognition = (): UseFacialRecognitionReturn => {
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const initializeFaceAPI = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      setProgress(0);

      if (typeof window === 'undefined' || !(window as any).faceapi) {
        throw new Error('Face-api.js no está cargado');
      }

      const faceapi = (window as any).faceapi;

      setProgress(20);
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      
      setProgress(40);
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      
      setProgress(60);
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      
      setProgress(80);
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      
      setProgress(100);
      setIsReady(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al inicializar Face API: ${errorMessage}`);
      setIsReady(false);
    }
  }, []);

  useEffect(() => {
    initializeFaceAPI();
  }, [initializeFaceAPI]);

  const loadImage = useCallback(async (imageData: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.src = imageData;
    });
  }, []);

  const detectFaces = useCallback(async (imageData: string): Promise<number> => {
    if (!isReady) {
      throw new Error('Face API no está inicializado');
    }

    try {
      setIsProcessing(true);
      setError(null);

      const faceapi = (window as any).faceapi;
      const img = await loadImage(imageData);

      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      return detections.length;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al detectar rostros: ${errorMessage}`);
      return 0;
    } finally {
      setIsProcessing(false);
    }
  }, [isReady, loadImage]);

  const validateFaceQuality = useCallback(async (
    imageData: string
  ): Promise<FaceQuality> => {
    if (!isReady) {
      throw new Error('Face API no está inicializado');
    }

    try {
      setIsProcessing(true);
      setError(null);

      const faceapi = (window as any).faceapi;
      const img = await loadImage(imageData);

      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detection) {
        return {
          score: 0,
          isGoodQuality: false,
          issues: ['No se detectó ningún rostro'],
        };
      }

      const issues: string[] = [];
      let qualityScore = 100;

      if (detection.detection.score < 0.8) {
        issues.push('Confianza de detección baja');
        qualityScore -= 30;
      }

      const box = detection.detection.box;
      const imageArea = img.width * img.height;
      const faceArea = box.width * box.height;
      const faceRatio = faceArea / imageArea;

      if (faceRatio < 0.1) {
        issues.push('El rostro es muy pequeño');
        qualityScore -= 20;
      } else if (faceRatio > 0.7) {
        issues.push('El rostro es muy grande');
        qualityScore -= 15;
      }

      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;
      const imageCenterX = img.width / 2;
      const imageCenterY = img.height / 2;
      const distanceFromCenter = Math.sqrt(
        Math.pow(centerX - imageCenterX, 2) + Math.pow(centerY - imageCenterY, 2)
      );
      const maxDistance = Math.sqrt(
        Math.pow(img.width / 2, 2) + Math.pow(img.height / 2, 2)
      );

      if (distanceFromCenter > maxDistance * 0.3) {
        issues.push('El rostro no está centrado');
        qualityScore -= 10;
      }

      const brightness = await calculateBrightness(img);
      if (brightness < 50) {
        issues.push('Imagen muy oscura');
        qualityScore -= 20;
      } else if (brightness > 200) {
        issues.push('Imagen muy brillante');
        qualityScore -= 15;
      }

      return {
        score: Math.max(0, qualityScore),
        isGoodQuality: qualityScore >= 70 && issues.length === 0,
        issues,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al validar calidad: ${errorMessage}`);
      return {
        score: 0,
        isGoodQuality: false,
        issues: ['Error al procesar la imagen'],
      };
    } finally {
      setIsProcessing(false);
    }
  }, [isReady, loadImage]);

  const calculateBrightness = async (img: HTMLImageElement): Promise<number> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 128;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let totalBrightness = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] ?? 0;
      const g = data[i + 1] ?? 0;
      const b = data[i + 2] ?? 0;

      if (r === 0 && g === 0 && b === 0) continue;
      totalBrightness += (r + g + b) / 3;
    }

    return totalBrightness / (data.length / 4);
  };

  const captureAndConvertToVector = useCallback(async (
    imageData: string
  ): Promise<Float32Array | null> => {
    if (!isReady) {
      throw new Error('Face API no está inicializado');
    }

    try {
      setIsProcessing(true);
      setError(null);

      const quality = await validateFaceQuality(imageData);
      
      if (!quality.isGoodQuality) {
        throw new Error(`Calidad insuficiente: ${quality.issues.join(', ')}`);
      }

      const faceapi = (window as any).faceapi;
      const img = await loadImage(imageData);

      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        throw new Error('No se pudo generar el vector facial');
      }

      return detection.descriptor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [isReady, loadImage, validateFaceQuality]);

  return {
    isReady,
    isProcessing,
    error,
    progress,
    initializeFaceAPI,
    captureAndConvertToVector,
    validateFaceQuality,
    detectFaces,
  };
};

export default useFacialRecognition;