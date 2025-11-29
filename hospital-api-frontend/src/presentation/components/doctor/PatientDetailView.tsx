import React, { useState, useEffect } from 'react';
import { X, Phone, AlertCircle, Pill, Activity, User, Clock, Printer, Download } from 'lucide-react';

interface EmergencyContact {
  name: string;
  phone: string;
  relationship?: string;
}

interface PatientData {
  id: string;
  name: string;
  dni: string;
  birthDate: string;
  age: number;
  bloodType: string;
  allergies?: string;
  baseConditions?: string;
  medications?: string;
  emergencyContacts: EmergencyContact[];
  photoUrl?: string;
}

interface PatientDetailViewProps {
  patient: PatientData;
  onClose: () => void;
  expirationMinutes?: number;
}

const PatientDetailView: React.FC<PatientDetailViewProps> = ({
  patient,
  onClose,
  expirationMinutes = 20
}) => {
  const [timeRemaining, setTimeRemaining] = useState(expirationMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining > 600) return 'text-green-600 bg-green-50 border-green-200';
    if (timeRemaining > 300) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200 animate-pulse';
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Header - Fixed */}
      <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Información del Paciente
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Timer */}
          <div className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border-2 ${getTimeColor()}`}>
            <Clock size={18} />
            <span className="text-sm font-semibold">
              Expira en: {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Patient Header Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {patient.photoUrl ? (
              <img
                src={patient.photoUrl}
                alt={patient.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <User size={48} className="text-blue-600" />
              </div>
            )}
            
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">{patient.name}</h3>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  DNI: {patient.dni}
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  {patient.age} años
                </span>
                <span className="bg-white px-3 py-1 rounded-full text-red-600 font-bold">
                  {patient.bloodType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Allergies Alert - Critical */}
        {patient.allergies && (
          <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 animate-pulse">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-red-600 shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h4 className="font-bold text-red-800 text-lg mb-2">
                  ⚠️ ALERGIAS IMPORTANTES
                </h4>
                <p className="text-red-700 whitespace-pre-wrap">{patient.allergies}</p>
              </div>
            </div>
          </div>
        )}

        {/* Medical Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Base Conditions */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity size={20} className="text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-800">Enfermedades Base</h4>
            </div>
            {patient.baseConditions ? (
              <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                {patient.baseConditions}
              </p>
            ) : (
              <p className="text-gray-500 text-sm italic">Sin enfermedades base registradas</p>
            )}
          </div>

          {/* Medications */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Pill size={20} className="text-green-600" />
              </div>
              <h4 className="font-bold text-gray-800">Medicamentos Actuales</h4>
            </div>
            {patient.medications ? (
              <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                {patient.medications}
              </p>
            ) : (
              <p className="text-gray-500 text-sm italic">Sin medicamentos registrados</p>
            )}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Phone size={20} className="text-red-600" />
            </div>
            <h4 className="font-bold text-gray-800">Contactos de Emergencia</h4>
          </div>

          <div className="space-y-3">
            {patient.emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-1">
                      {contact.name}
                      {contact.relationship && (
                        <span className="text-sm text-gray-600 ml-2">
                          ({contact.relationship})
                        </span>
                      )}
                    </p>
                    <p className="text-gray-700 font-mono text-sm">{contact.phone}</p>
                  </div>
                  <button
                    onClick={() => handleCall(contact.phone)}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md shrink-0"
                  >
                    <Phone size={18} />
                    <span>Llamar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h4 className="font-bold text-gray-800 mb-4">Información Personal</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Fecha de Nacimiento</p>
              <p className="font-semibold text-gray-800">{patient.birthDate}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Edad</p>
              <p className="font-semibold text-gray-800">{patient.age} años</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">DNI</p>
              <p className="font-semibold text-gray-800">{patient.dni}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <p className="text-xs text-gray-600 mb-1">Grupo Sanguíneo</p>
              <p className="font-bold text-red-600 text-xl">{patient.bloodType}</p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div className="flex-1">
              <p className="text-xs text-blue-800">
                <span className="font-semibold">Recordatorio de privacidad:</span> Esta información
                es confidencial y expirará automáticamente en {formatTime(timeRemaining)}. No compartas
                ni copies datos sensibles.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            <Printer size={20} />
            <span>Imprimir</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            <X size={20} />
            <span>Cerrar Vista</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailView;