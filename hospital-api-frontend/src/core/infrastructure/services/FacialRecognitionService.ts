import * as faceapi from 'face-api.jsx';

export interface FaceDetectionResult {
  descriptor: Float32Array;
  detection: faceapi.FaceDetection;
  landmarks: faceapi.FaceLandmarks68;
  quality: number;
}

export class FacialRecognitionService {
  private modelsLoaded: boolean = false;
  private readonly MODEL_URL = '/models';
  private readonly CONFIDENCE_THRESHOLD = 0.6;
  private readonly QUALITY_THRESHOLD = 0.7;

  async initialize(): Promise<void> {
    if (this.modelsLoaded) return;

    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(this.MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(this.MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(this.MODEL_URL)
      ]);
      
      this.modelsLoaded = true;
      console.log('Face-api models loaded successfully');
    } catch (error) {
      console.error('Error loading face-api models:', error);
      throw new Error('Failed to initialize facial recognition service');
    }
  }

  async convertImageToFaceVector(imageFile: File): Promise<Float32Array | null> {
    await this.ensureModelsLoaded();

    try {
      const img = await this.loadImage(imageFile);
      const detectionResult = await this.detectFace(img);

      if (!detectionResult) {
        return null;
      }

      return detectionResult.descriptor;

    } catch (error) {
      console.error('Error converting image to face vector:', error);
      return null;
    }
  }

  async validateFaceQuality(imageFile: File): Promise<number> {
    await this.ensureModelsLoaded();

    try {
      const img = await this.loadImage(imageFile);
      const detectionResult = await this.detectFace(img);

      if (!detectionResult) {
        return 0;
      }

      return detectionResult.quality;

    } catch (error) {
      console.error('Error validating face quality:', error);
      return 0;
    }
  }

  async detectMultipleFaces(imageFile: File): Promise<FaceDetectionResult[]> {
    await this.ensureModelsLoaded();

    try {
      const img = await this.loadImage(imageFile);
      
      const detections = await faceapi
        .detectAllFaces(img)
        .withFaceLandmarks()
        .withFaceDescriptors();

      return detections.map(detection => ({
        descriptor: detection.descriptor,
        detection: detection.detection,
        landmarks: detection.landmarks,
        quality: this.calculateFaceQuality(detection)
      }));

    } catch (error) {
      console.error('Error detecting multiple faces:', error);
      return [];
    }
  }

  calculateSimilarity(vector1: Float32Array, vector2: Float32Array): number {
    const distance = faceapi.euclideanDistance(vector1, vector2);
    const similarity = 1 - Math.min(distance, 1);
    return similarity;
  }

  private async detectFace(img: HTMLImageElement): Promise<FaceDetectionResult | null> {
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      return null;
    }

    const quality = this.calculateFaceQuality(detection);

    if (quality < this.QUALITY_THRESHOLD) {
      return null;
    }

    return {
      descriptor: detection.descriptor,
      detection: detection.detection,
      landmarks: detection.landmarks,
      quality
    };
  }

  private calculateFaceQuality(detection: faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection; landmarks: faceapi.FaceLandmarks68; descriptor: Float32Array }>>): number {
    const detectionScore = detection.detection.score;
    
    const landmarks = detection.landmarks;
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const nose = landmarks.getNose();
    
    const leftEyePoint = leftEye?.[0];
    const rightEyePoint = rightEye?.[0];

    if (!leftEyePoint || !rightEyePoint) {
      return 0.7; // valor por defecto si no se detectan ojos
    }

    const eyeDistance = Math.sqrt(
      Math.pow(rightEyePoint.x - leftEyePoint.x, 2) +
      Math.pow(rightEyePoint.y - leftEyePoint.y, 2)
    );
    
    const faceWidth = detection.detection.box.width;
    const eyeDistanceRatio = eyeDistance / faceWidth;
    
    const landmarkQuality = eyeDistanceRatio > 0.2 && eyeDistanceRatio < 0.5 ? 1 : 0.7;
    
    const sizeQuality = faceWidth > 150 && faceWidth < 800 ? 1 : 0.8;
    
    const overallQuality = (detectionScore * 0.5) + (landmarkQuality * 0.3) + (sizeQuality * 0.2);
    
    return Math.min(overallQuality, 1);
  }

  private async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }

  private async ensureModelsLoaded(): Promise<void> {
    if (!this.modelsLoaded) {
      await this.initialize();
    }
  }

  isInitialized(): boolean {
    return this.modelsLoaded;
  }
}