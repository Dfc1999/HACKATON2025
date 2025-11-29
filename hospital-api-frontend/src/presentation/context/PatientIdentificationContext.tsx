import React, { createContext, useContext, useCallback, useEffect } from 'react';
import usePatientIdentification from '../hooks/usePatientIdentification.tsx';

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

interface PatientIdentificationContextType {
  step: IdentificationStep;
  matches: PatientMatch[];
  selectedPatient: PatientData | null;
  expiresAt: number | null;
  isProcessing: boolean;
  error: string | null;
  timeRemaining: number;
  startIdentification: () => void;
  submitFaceVector: (imageData: string) => Promise<void>;
  selectMatch: (matchId: string) => Promise<void>;
  getFullPatientData: () => PatientData | null;
  reset: () => void;
  cancelIdentification: () => void;
}

const PatientIdentificationContext = createContext<PatientIdentificationContextType | undefined>(
  undefined
);

export const usePatientIdentificationContext = (): PatientIdentificationContextType => {
  const context = useContext(PatientIdentificationContext);
  if (!context) {
    throw new Error(
      'usePatientIdentificationContext debe usarse dentro de un PatientIdentificationProvider'
    );
  }
  return context;
};

interface PatientIdentificationProviderProps {
  children: React.ReactNode;
  autoCleanup?: boolean;
}

export const PatientIdentificationProvider: React.FC<PatientIdentificationProviderProps> = ({
  children,
  autoCleanup = true,
}) => {
  const identification = usePatientIdentification();
  const [timeRemaining, setTimeRemaining] = React.useState(0);

  useEffect(() => {
    if (identification.expiresAt) {
      const interval = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.floor((identification.expiresAt! - Date.now()) / 1000)
        );
        setTimeRemaining(remaining);

        if (remaining === 0 && autoCleanup) {
          identification.reset();
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setTimeRemaining(0);
    }
  }, [identification.expiresAt, identification.reset, autoCleanup]);

  useEffect(() => {
    if (identification.step === 'error' && autoCleanup) {
      const timeout = setTimeout(() => {
        identification.reset();
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [identification.step, identification.reset, autoCleanup]);

  const value: PatientIdentificationContextType = {
    ...identification,
    timeRemaining,
  };

  return (
    <PatientIdentificationContext.Provider value={value}>
      {children}
    </PatientIdentificationContext.Provider>
  );
};