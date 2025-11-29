import { useState, useCallback } from 'react';
import useAgentCommunication from './useAgentCommunication.js';
import useFacialRecognition from './useFacialRecognition.js';
import useSecureStorage from './useSecureStorage.js';

interface PatientMatch {
  id: string;
  name: string;
  confidence: number;
  organizationId: string;
  lastVisit?: string;
  photoUrl?: string;
}

interface PatientData {
  id: string;
  fullName: string;
  dateOfBirth: string;
  organizationId: string;
  medicalRecordNumber: string;
  photoUrl?: string;
  lastVisit?: string;
  allergies?: string[];
  currentMedications?: string[];
}

type IdentificationStep = 
  | 'idle'
  | 'capturing'
  | 'processing'
  | 'searching'
  | 'matches_found'
  | 'patient_selected'
  | 'completed'
  | 'error';

interface UsePatientIdentificationReturn {
  step: IdentificationStep;
  matches: PatientMatch[];
  selectedPatient: PatientData | null;
  expiresAt: number | null;
  isProcessing: boolean;
  error: string | null;
  startIdentification: () => void;
  submitFaceVector: (imageData: string) => Promise<void>;
  selectMatch: (matchId: string) => Promise<void>;
  getFullPatientData: () => PatientData | null;
  reset: () => void;
  cancelIdentification: () => void;
}

const usePatientIdentification = (): UsePatientIdentificationReturn => {
  const [step, setStep] = useState<IdentificationStep>('idle');
  const [matches, setMatches] = useState<PatientMatch[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { sendMessage, isWaiting } = useAgentCommunication('/api/patient-identification');
  const { captureAndConvertToVector, validateFaceQuality, isReady } = useFacialRecognition();
  const { storeTemporary, retrieve, clear } = useSecureStorage();

  const IDENTIFICATION_KEY = 'current_identification';
  const EXPIRATION_MINUTES = 20;

  const startIdentification = useCallback((): void => {
    setStep('capturing');
    setMatches([]);
    setSelectedPatient(null);
    setError(null);
    clear(IDENTIFICATION_KEY);
    
    const expirationTime = Date.now() + EXPIRATION_MINUTES * 60 * 1000;
    setExpiresAt(expirationTime);
  }, [clear]);

  const submitFaceVector = useCallback(async (imageData: string): Promise<void> => {
    try {
      setIsProcessing(true);
      setError(null);
      setStep('processing');

      if (!isReady) {
        throw new Error('Sistema de reconocimiento facial no está listo');
      }

      const quality = await validateFaceQuality(imageData);
      
      if (!quality.isGoodQuality) {
        throw new Error(
          `Calidad de imagen insuficiente: ${quality.issues.join(', ')}`
        );
      }

      const faceVector = await captureAndConvertToVector(imageData);
      
      if (!faceVector) {
        throw new Error('No se pudo generar el vector facial');
      }

      setStep('searching');

      const response = await sendMessage('identify_patient', {
        faceVector: Array.from(faceVector),
        timestamp: Date.now(),
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Error al buscar coincidencias');
      }

      const patientMatches: PatientMatch[] = response.data.matches || [];

      if (patientMatches.length === 0) {
        setStep('error');
        setError('No se encontraron coincidencias en el sistema');
        return;
      }

      setMatches(patientMatches);
      setStep('matches_found');

      storeTemporary(IDENTIFICATION_KEY, {
        matches: patientMatches,
        timestamp: Date.now(),
      }, EXPIRATION_MINUTES);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  }, [
    isReady,
    validateFaceQuality,
    captureAndConvertToVector,
    sendMessage,
    storeTemporary,
  ]);

  const selectMatch = useCallback(async (matchId: string): Promise<void> => {
    try {
      setIsProcessing(true);
      setError(null);
      setStep('patient_selected');

      const response = await sendMessage('get_patient_details', {
        patientId: matchId,
        timestamp: Date.now(),
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Error al obtener datos del paciente');
      }

      const patientData: PatientData = response.data.patient;
      setSelectedPatient(patientData);
      setStep('completed');

      storeTemporary(IDENTIFICATION_KEY, {
        selectedPatient: patientData,
        timestamp: Date.now(),
      }, EXPIRATION_MINUTES);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  }, [sendMessage, storeTemporary]);

  const getFullPatientData = useCallback((): PatientData | null => {
    if (selectedPatient) {
      return selectedPatient;
    }

    const stored = retrieve<{ selectedPatient: PatientData }>(IDENTIFICATION_KEY);
    
    if (stored && stored.selectedPatient) {
      setSelectedPatient(stored.selectedPatient);
      setStep('completed');
      return stored.selectedPatient;
    }

    return null;
  }, [selectedPatient, retrieve]);

  const reset = useCallback((): void => {
    setStep('idle');
    setMatches([]);
    setSelectedPatient(null);
    setExpiresAt(null);
    setError(null);
    setIsProcessing(false);
    clear(IDENTIFICATION_KEY);
  }, [clear]);

  const cancelIdentification = useCallback((): void => {
    reset();
  }, [reset]);

  return {
    step,
    matches,
    selectedPatient,
    expiresAt,
    isProcessing: isProcessing || isWaiting,
    error,
    startIdentification,
    submitFaceVector,
    selectMatch,
    getFullPatientData,
    reset,
    cancelIdentification,
  };
};

export default usePatientIdentification;