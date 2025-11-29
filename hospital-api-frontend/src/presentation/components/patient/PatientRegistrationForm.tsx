import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import TermsAndConditionsModal from './TermsAndConditionsModal.tsx';
import FacialCaptureGuide from './FacialCaptureGuide.tsx';
import PhotoConfirmation from './PhotoConfirmation.tsx';
import CameraCapture from '../shared/CameraCapture.tsx';

interface FormData {
  termsAccepted: boolean;
  fullName: string;
  dni: string;
  birthDate: string;
  bloodType: string;
  allergies: string;
  baseConditions: string;
  medications: string;
  emergencyContact1Name: string;
  emergencyContact1Phone: string;
  emergencyContact2Name: string;
  emergencyContact2Phone: string;
  faceVector?: Float32Array | undefined;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PatientRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    termsAccepted: false,
    fullName: '',
    dni: '',
    birthDate: '',
    bloodType: '',
    allergies: '',
    baseConditions: '',
    medications: '',
    emergencyContact1Name: '',
    emergencyContact1Phone: '',
    emergencyContact2Name: '',
    emergencyContact2Phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 5;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1 && !formData.termsAccepted) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
    }

    if (step === 2) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Nombre completo requerido';
      if (!formData.dni.trim()) newErrors.dni = 'DNI requerido';
      if (formData.dni.length < 7) newErrors.dni = 'DNI inválido';
      if (!formData.birthDate) newErrors.birthDate = 'Fecha de nacimiento requerida';
      if (!formData.bloodType) newErrors.bloodType = 'Grupo sanguíneo requerido';
    }

    if (step === 4) {
      if (!formData.emergencyContact1Name.trim()) newErrors.ec1Name = 'Contacto 1 requerido';
      if (!formData.emergencyContact1Phone.trim()) newErrors.ec1Phone = 'Teléfono 1 requerido';
      if (!formData.emergencyContact2Name.trim()) newErrors.ec2Name = 'Contacto 2 requerido';
      if (!formData.emergencyContact2Phone.trim()) newErrors.ec2Phone = 'Teléfono 2 requerido';
    }

    if (step === 5 && !formData.faceVector) {
      newErrors.face = 'Debes capturar tu foto facial';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('¡Registro exitoso! Bienvenido al sistema.');
    } catch (error) {
      alert('Error al registrar. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoCapture = (photo: string, vector: Float32Array) => {
    setCapturedPhoto(photo);
    setFormData({ ...formData, faceVector: vector  });
    setShowCamera(false);
  };

  const handlePhotoConfirm = () => {
    handleNext();
  };

  const handlePhotoRetake = () => {
    setCapturedPhoto(null);
    setFormData({ ...formData, faceVector: undefined });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-24">
      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step < currentStep
                    ? 'bg-green-500 text-white'
                    : step === currentStep
                    ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step < currentStep ? <Check size={20} /> : step}
              </div>
              {step < 5 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-gray-600">
          Paso {currentStep} de {totalSteps}
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
        {/* Step 1: Terms */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Términos y Condiciones
              </h2>
              <p className="text-gray-600">Lee y acepta para continuar</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                Al registrarte, autorizas el procesamiento de tus datos biométricos (reconocimiento facial)
                para fines de identificación médica. Tus datos serán protegidos según normativas vigentes.
              </p>
            </div>

            <button
              onClick={() => setShowTermsModal(true)}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Leer Términos Completos
            </button>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 flex-1">
                He leído y acepto los términos y condiciones, políticas de privacidad y el tratamiento de
                mis datos biométricos
              </span>
            </label>

            {errors.terms && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors.terms}</span>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Personal Data */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Datos Personales
              </h2>
              <p className="text-gray-600">Información básica del paciente</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Juan Pérez García"
                />
                {errors.fullName && (
                  <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DNI/CI *</label>
                <input
                  type="text"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12345678"
                />
                {errors.dni && <p className="text-red-600 text-sm mt-1">{errors.dni}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.birthDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.birthDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grupo Sanguíneo *
                </label>
                <select
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona tu grupo sanguíneo</option>
                  {BLOOD_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.bloodType && (
                  <p className="text-red-600 text-sm mt-1">{errors.bloodType}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Medical Info */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Información Médica
              </h2>
              <p className="text-gray-600">Datos clínicos importantes</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alergias
                </label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Ej: Penicilina, mariscos, polen..."
                />
                <p className="text-xs text-gray-500 mt-1">Déjalo vacío si no tienes alergias conocidas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enfermedades Base o Crónicas
                </label>
                <textarea
                  value={formData.baseConditions}
                  onChange={(e) => setFormData({ ...formData, baseConditions: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Ej: Diabetes tipo 2, hipertensión, asma..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicamentos Actuales
                </label>
                <textarea
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Ej: Metformina 850mg (2 veces al día), Losartán 50mg..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Emergency Contacts */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Contactos de Emergencia
              </h2>
              <p className="text-gray-600">Mínimo 2 contactos requeridos</p>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold text-gray-800 mb-3">Contacto 1 *</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.emergencyContact1Name}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyContact1Name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre completo"
                  />
                  {errors.ec1Name && (
                    <p className="text-red-600 text-sm">{errors.ec1Name}</p>
                  )}
                  <input
                    type="tel"
                    value={formData.emergencyContact1Phone}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyContact1Phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Teléfono"
                  />
                  {errors.ec1Phone && (
                    <p className="text-red-600 text-sm">{errors.ec1Phone}</p>
                  )}
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h3 className="font-semibold text-gray-800 mb-3">Contacto 2 *</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.emergencyContact2Name}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyContact2Name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre completo"
                  />
                  {errors.ec2Name && (
                    <p className="text-red-600 text-sm">{errors.ec2Name}</p>
                  )}
                  <input
                    type="tel"
                    value={formData.emergencyContact2Phone}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyContact2Phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Teléfono"
                  />
                  {errors.ec2Phone && (
                    <p className="text-red-600 text-sm">{errors.ec2Phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Facial Capture */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Captura Facial
              </h2>
              <p className="text-gray-600">Último paso para completar tu registro</p>
            </div>

            {!capturedPhoto && !showCamera && (
              <>
                <FacialCaptureGuide />
                <button
                  onClick={() => setShowCamera(true)}
                  className="w-full py-4 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
                >
                  Abrir Cámara
                </button>
              </>
            )}

            {showCamera && !capturedPhoto && (
              <CameraCapture
                onCapture={handlePhotoCapture}
                onCancel={() => setShowCamera(false)}
              />
            )}

            {capturedPhoto && formData.faceVector && (
              <PhotoConfirmation
                photoUrl={capturedPhoto}
                onConfirm={handlePhotoConfirm}
                onRetake={handlePhotoRetake}
                confidenceScore={0.95}
              />
            )}

            {errors.face && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors.face}</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {currentStep > 1 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <ChevronLeft size={20} className="mr-1" />
              Anterior
            </button>
          )}
          
          {currentStep < totalSteps && (
            <button
              onClick={handleNext}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Siguiente
              <ChevronRight size={20} className="ml-1" />
            </button>
          )}

          {currentStep === totalSteps && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Registrando...
                </>
              ) : (
                <>
                  <Check size={20} className="mr-1" />
                  Completar Registro
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {showTermsModal && (
        <TermsAndConditionsModal
          onAccept={() => {
            setFormData({ ...formData, termsAccepted: true });
            setShowTermsModal(false);
          }}
          onClose={() => setShowTermsModal(false)}
        />
      )}
    </div>
  );
};

export default PatientRegistrationForm;