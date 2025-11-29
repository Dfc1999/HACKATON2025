import React, { useState } from 'react';
import { X, Camera, Search, Loader } from 'lucide-react';

interface PatientIdentificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientSelect: (patientId: string) => void;
}

const PatientIdentificationModal: React.FC<PatientIdentificationModalProps> = ({
  isOpen,
  onClose,
  onPatientSelect
}) => {
  const [activeTab, setActiveTab] = useState<'face' | 'dni'>('face');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  if (!isOpen) return null;

  const handleFaceCapture = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 3) {
      setSearchResults([
        { id: '1', name: 'María González Pérez', dni: '12345678', age: 35 },
        { id: '2', name: 'Juan Carlos Mamani', dni: '87654321', age: 42 }
      ]);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black bg-opacity-60 p-0 md:p-4">
      <div className="bg-white w-full md:max-w-4xl md:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh] animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Identificar Paciente
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 shrink-0">
          <button
            onClick={() => setActiveTab('face')}
            className={`flex-1 py-4 px-6 font-medium transition-colors relative ${
              activeTab === 'face'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Camera size={20} />
              <span className="hidden sm:inline">Reconocimiento Facial</span>
              <span className="sm:hidden">Rostro</span>
            </div>
            {activeTab === 'face' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('dni')}
            className={`flex-1 py-4 px-6 font-medium transition-colors relative ${
              activeTab === 'dni'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Search size={20} />
              <span className="hidden sm:inline">Buscar por DNI</span>
              <span className="sm:hidden">DNI</span>
            </div>
            {activeTab === 'dni' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === 'face' && (
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Instrucciones
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Asegúrate de tener buena iluminación</li>
                  <li>• Solicita al paciente que mire directamente a la cámara</li>
                  <li>• El rostro debe estar completamente visible</li>
                  <li>• La identificación toma aproximadamente 2-3 segundos</li>
                </ul>
              </div>

              {/* Camera Area */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12 text-center">
                {!isProcessing ? (
                  <>
                    <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Camera size={64} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Listo para Identificar
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Presiona el botón para activar la cámara
                    </p>
                    <button
                      onClick={handleFaceCapture}
                      className="px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      Abrir Cámara
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Loader size={64} className="text-blue-600 animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Procesando...
                    </h3>
                    <p className="text-sm text-gray-600">
                      El agente está buscando coincidencias
                    </p>
                    <div className="mt-6 max-w-md mx-auto">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Security Note */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-gray-700 flex items-start">
                  <span className="text-green-600 mr-2">🔒</span>
                  <span>
                    La imagen se procesa localmente y se descarta inmediatamente. Solo se transmite
                    el vector facial encriptado.
                  </span>
                </p>
              </div>
            </div>
          )}

          {activeTab === 'dni' && (
            <div className="space-y-6">
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Ingresa DNI o nombre del paciente"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
              </div>

              {/* Search Tips */}
              {searchQuery.length === 0 && (
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <Search size={48} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">
                    Ingresa al menos 3 caracteres para comenzar la búsqueda
                  </p>
                </div>
              )}

              {/* Results */}
              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    {searchResults.length} resultados encontrados
                  </p>
                  {searchResults.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => onPatientSelect(patient.id)}
                      className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {patient.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {patient.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                            <span>DNI: {patient.dni}</span>
                            <span>•</span>
                            <span>{patient.age} años</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No results */}
              {searchQuery.length >= 3 && searchResults.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                  <p className="text-gray-700 font-medium mb-2">
                    No se encontraron resultados
                  </p>
                  <p className="text-sm text-gray-600">
                    Verifica el DNI o intenta con el nombre completo
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientIdentificationModal;