import React, { useState } from 'react';
import { FileText, CheckCircle, XCircle, AlertTriangle, Loader, ZoomIn } from 'lucide-react';

interface DoctorValidationFormProps {
  doctorId: string;
  onApprove: (notes: string) => void;
  onReject: (reason: string) => void;
  onRequestMore: (message: string) => void;
}

const DoctorValidationForm: React.FC<DoctorValidationFormProps> = ({
  doctorId,
  onApprove,
  onReject,
  onRequestMore
}) => {
  const [ocrData, setOcrData] = useState({
    licenseNumber: '12345-LP',
    specialty: 'Cardiología',
    issueDate: '2020-03-15',
    confidence: 0.95
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'verified' | 'not_found' | null>(null);
  const [manualLicense, setManualLicense] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const mockDocuments = {
    idCard: '/api/placeholder/800/500',
    license: '/api/placeholder/800/500'
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setVerificationResult('verified');
    setIsVerifying(false);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Validación de Doctor</h2>
        <p className="text-blue-100">ID: {doctorId}</p>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Documentos Subidos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ID Card */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Carnet de Identidad
            </label>
            <div 
              className="relative group cursor-pointer rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all"
              onClick={() => handleImageClick(mockDocuments.idCard)}
            >
              <img
                src={mockDocuments.idCard}
                alt="Carnet de identidad"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
              </div>
            </div>
          </div>

          {/* License */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Matrícula Profesional
            </label>
            <div 
              className="relative group cursor-pointer rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all"
              onClick={() => handleImageClick(mockDocuments.license)}
            >
              <img
                src={mockDocuments.license}
                alt="Matrícula profesional"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OCR Results */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Datos Extraídos (OCR)</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            ocrData.confidence >= 0.9 
              ? 'bg-green-100 text-green-700' 
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            Confianza: {Math.round(ocrData.confidence * 100)}%
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Número de Matrícula</p>
            <p className="font-semibold text-gray-800 text-lg">{ocrData.licenseNumber}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Especialidad</p>
            <p className="font-semibold text-gray-800 text-lg">{ocrData.specialty}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Fecha de Emisión</p>
            <p className="font-semibold text-gray-800">{ocrData.issueDate}</p>
          </div>
        </div>

        {ocrData.confidence < 0.9 && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm text-yellow-800 font-medium mb-2">
                  Baja confianza en OCR
                </p>
                <p className="text-xs text-yellow-700 mb-3">
                  Verifica y corrige los datos manualmente si es necesario
                </p>
                <input
                  type="text"
                  value={manualLicense}
                  onChange={(e) => setManualLicense(e.target.value)}
                  placeholder="Corrección manual del número de matrícula"
                  className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verification */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Verificación en Base de Datos
        </h3>

        {!verificationResult && (
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
          >
            {isVerifying ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Verificando en Colegio Médico...</span>
              </>
            ) : (
              <>
                <FileText size={20} />
                <span>Verificar Matrícula</span>
              </>
            )}
          </button>
        )}

        {verificationResult === 'verified' && (
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <CheckCircle className="text-green-600 shrink-0" size={32} />
              <div className="flex-1">
                <h4 className="text-lg font-bold text-green-800 mb-2">
                  ✓ Matrícula Verificada
                </h4>
                <p className="text-green-700 text-sm mb-3">
                  El número de matrícula {ocrData.licenseNumber} está registrado en el Colegio
                  Médico de Bolivia.
                </p>
                <div className="bg-white rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className="font-semibold text-green-700">Activo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Especialidad:</span>
                    <span className="font-semibold text-gray-800">{ocrData.specialty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Último Registro:</span>
                    <span className="font-semibold text-gray-800">2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {verificationResult === 'not_found' && (
          <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <XCircle className="text-red-600 shrink-0" size={32} />
              <div className="flex-1">
                <h4 className="text-lg font-bold text-red-800 mb-2">
                  Matrícula No Encontrada
                </h4>
                <p className="text-red-700 text-sm">
                  No se pudo verificar el número de matrícula en la base de datos del Colegio Médico.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Notes */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Notas del Administrador</h3>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Agrega observaciones, comentarios o razones de la decisión..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onReject(adminNotes)}
            className="flex items-center justify-center space-x-2 py-4 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition-colors"
          >
            <XCircle size={20} />
            <span>Rechazar</span>
          </button>
          <button
            onClick={() => onRequestMore(adminNotes)}
            className="flex items-center justify-center space-x-2 py-4 bg-yellow-100 text-yellow-700 rounded-xl font-medium hover:bg-yellow-200 transition-colors"
          >
            <AlertTriangle size={20} />
            <span>Solicitar Más Info</span>
          </button>
          <button
            onClick={() => onApprove(adminNotes)}
            disabled={verificationResult !== 'verified'}
            className="flex items-center justify-center space-x-2 py-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <CheckCircle size={20} />
            <span>Aprobar</span>
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Vista ampliada"
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default DoctorValidationForm;