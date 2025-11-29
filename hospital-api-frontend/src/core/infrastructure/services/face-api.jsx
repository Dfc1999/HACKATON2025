// Mock de face-api.jsx para desarrollo y pruebas sin dependencias reales
// Este archivo simula las funciones y estructuras básicas de la librería face-api.js

export const nets = {
  ssdMobilenetv1: { loadFromUri: async (url) => console.log(`Mock: cargando modelo ssdMobilenetv1 desde ${url}`) },
  faceLandmark68Net: { loadFromUri: async (url) => console.log(`Mock: cargando modelo faceLandmark68Net desde ${url}`) },
  faceRecognitionNet: { loadFromUri: async (url) => console.log(`Mock: cargando modelo faceRecognitionNet desde ${url}`) },
};

export class FaceDetection {
  constructor(score = 0.9, box = { width: 200, height: 200 }) {
    this.score = score;
    this.box = box;
  }
}

export class FaceLandmarks68 {
  getLeftEye() { return [{ x: 30, y: 40 }]; }
  getRightEye() { return [{ x: 70, y: 40 }]; }
  getNose() { return [{ x: 50, y: 60 }]; }
}

export const detectSingleFace = async (img) => ({
  detection: new FaceDetection(),
  landmarks: new FaceLandmarks68(),
  descriptor: new Float32Array(128),
});

export const detectAllFaces = async (img) => [
  {
    detection: new FaceDetection(),
    landmarks: new FaceLandmarks68(),
    descriptor: new Float32Array(128),
  },
];

export const euclideanDistance = (v1, v2) => {
  let sum = 0;
  for (let i = 0; i < v1.length; i++) {
    sum += (v1[i] - v2[i]) ** 2;
  }
  return Math.sqrt(sum);
};

export const withFaceLandmarks = () => ({
  withFaceDescriptors: async () => await detectAllFaces(),
});

export const withFaceDescriptor = async () => await detectSingleFace();

export const loadFromUri = async (url) => console.log(`Mock: cargando modelo desde ${url}`);

export default {
  nets,
  detectSingleFace,
  detectAllFaces,
  euclideanDistance,
  withFaceLandmarks,
  withFaceDescriptor,
  loadFromUri,
  FaceDetection,
  FaceLandmarks68,
};