import React from 'react';
import { Sun, UserCircle, Glasses, Smile, Check, X } from 'lucide-react';

const FacialCaptureGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
            i
          </span>
          Consejos para una Captura Exitosa
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Good practices */}
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2 text-green-600 font-medium mb-2">
              <Check size={20} />
              <span>Hacer</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Sun className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-800">Buena iluminación</p>
                  <p className="text-xs text-gray-600">
                    Usa luz natural o artificial frontal
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <UserCircle className="text-blue-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-800">Rostro centrado</p>
                  <p className="text-xs text-gray-600">
                    Mantén tu cara en el centro del óvalo
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Smile className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-800">Expresión neutra</p>
                  <p className="text-xs text-gray-600">
                    Rostro relajado mirando al frente
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bad practices */}
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2 text-red-600 font-medium mb-2">
              <X size={20} />
              <span>Evitar</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Glasses className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-800">Accesorios</p>
                  <p className="text-xs text-gray-600">
                    Sin lentes, gorros o bufandas
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-gray-800 rounded-full flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Contraluz</p>
                  <p className="text-xs text-gray-600">
                    No tomes la foto con luz detrás
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 border-2 border-red-500 rounded-full flex-shrink-0 mt-1 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Rostro parcial</p>
                  <p className="text-xs text-gray-600">
                    Tu cara debe estar completamente visible
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Examples */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Ejemplos Visuales
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Good example */}
          <div className="text-center">
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-2">
              <div className="w-full aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                <UserCircle size={80} className="text-green-600" />
                <div className="absolute inset-0 border-4 border-dashed border-green-400 rounded-lg opacity-50" />
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Check size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-700">Correcto</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Rostro centrado, bien iluminado
            </p>
          </div>

          {/* Bad example */}
          <div className="text-center">
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-2">
              <div className="w-full aspect-square bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                <UserCircle size={80} className="text-red-600 transform -translate-x-8 -translate-y-4" />
                <div className="absolute inset-0 border-4 border-dashed border-red-400 rounded-lg opacity-50" />
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <X size={16} className="text-red-600" />
              <span className="text-sm font-medium text-red-700">Incorrecto</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Rostro descentrado, mal encuadre
            </p>
          </div>
        </div>
      </div>

      {/* Positioning tip */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-yellow-500 text-white rounded-full p-1 flex-shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800 mb-1">
              Consejo de Posicionamiento
            </p>
            <p className="text-xs text-gray-700 leading-relaxed">
              Sostén el dispositivo a la altura de tus ojos, aproximadamente a 30-40 cm de distancia.
              Asegúrate de que toda tu cara esté dentro del óvalo guía que aparecerá en la cámara.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-xs text-gray-700 leading-relaxed">
              <span className="font-semibold">Tu privacidad es importante:</span> La foto se procesa
              localmente en tu dispositivo. Solo se envía un vector matemático encriptado al servidor,
              nunca la imagen original.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacialCaptureGuide;