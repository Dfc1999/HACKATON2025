// Declaraciones de tipos para el mock de face-api.jsx
// Permite que TypeScript reconozca el módulo y sus estructuras

declare module 'face-api.jsx' {
  // Tipos auxiliares para compatibilidad con FacialRecognitionService
  export type WithFaceDescriptor<T = { detection: FaceDetection; landmarks: FaceLandmarks68; descriptor: Float32Array }> = T;
  export type WithFaceLandmarks<T = { detection: FaceDetection; landmarks: FaceLandmarks68 }> = T;
  export const nets: {
    ssdMobilenetv1: { loadFromUri: (url: string) => Promise<void> };
    faceLandmark68Net: { loadFromUri: (url: string) => Promise<void> };
    faceRecognitionNet: { loadFromUri: (url: string) => Promise<void> };
  };

  export class FaceDetection {
    score: number;
    box: { width: number; height: number };
    constructor(score?: number, box?: { width: number; height: number });
  }

  export class FaceLandmarks68 {
    getLeftEye(): { x: number; y: number }[];
    getRightEye(): { x: number; y: number }[];
    getNose(): { x: number; y: number }[];
  }

  export const detectSingleFace: (img: HTMLImageElement) => {
    withFaceLandmarks: () => {
      withFaceDescriptor: () => Promise<{
        detection: FaceDetection;
        landmarks: FaceLandmarks68;
        descriptor: Float32Array;
      }>;
    };
  };

  export const detectAllFaces: (img: HTMLImageElement) => {
    withFaceLandmarks: () => {
      withFaceDescriptors: () => Promise<
        {
          detection: FaceDetection;
          landmarks: FaceLandmarks68;
          descriptor: Float32Array;
        }[]
      >;
    };
  };

  export const detectSingleFace: (img: HTMLImageElement) => {
    withFaceLandmarks: () => {
      withFaceDescriptor: () => Promise<{
        detection: FaceDetection;
        landmarks: FaceLandmarks68;
        descriptor: Float32Array;
      }>;
    };
  };

  export const euclideanDistance: (v1: Float32Array, v2: Float32Array) => number;

  export const withFaceLandmarks: () => {
    withFaceDescriptors: () => Promise<
      {
        detection: FaceDetection;
        landmarks: FaceLandmarks68;
        descriptor: Float32Array;
      }[]
    >;
  };

  export const withFaceDescriptor: () => Promise<{
    detection: FaceDetection;
    landmarks: FaceLandmarks68;
    descriptor: Float32Array;
  }>;

  export const loadFromUri: (url: string) => Promise<void>;

  const faceapi: {
    nets: typeof nets;
    detectSingleFace: typeof detectSingleFace;
    detectAllFaces: typeof detectAllFaces;
    euclideanDistance: typeof euclideanDistance;
    withFaceLandmarks: typeof withFaceLandmarks;
    withFaceDescriptor: typeof withFaceDescriptor;
    loadFromUri: typeof loadFromUri;
    FaceDetection: typeof FaceDetection;
    FaceLandmarks68: typeof FaceLandmarks68;
  };

  export default faceapi;
}