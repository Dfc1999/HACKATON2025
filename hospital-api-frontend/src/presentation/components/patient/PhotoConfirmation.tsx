import React from 'react';
import { Check, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';

interface PhotoConfirmationProps {
  photoUrl: string;
  onConfirm: () => void;
  onRetake: () => void;
  confidenceScore: number;
}

const PhotoConfirmation: React.FC<PhotoConfirmationProps> = ({
  photoUrl,
  onConfirm,
  onRetake,
  confidenceScore
}) => {
  const getQualityInfo = (score: number) => {
    if (score >= 0.9) {
      return {
        label: 'Excelente',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: CheckCircle,
        message: 'La calidad de detección facial es excelente. Esta foto es ideal para el registro.'
      };
    } else if (score >= 0.75) {
      return {
        label: 'Buena',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: CheckCircle,
        message: 'La calidad de detección es buena. Puedes continuar con confianza.'
      };
    } else if (score >= 0.6) {
      return {
        label: 'Aceptable',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: AlertTriangle,
        message: 'La foto es aceptable, pero te recomendamos retomar con mejor iluminación.'
      };
    } else {
      return {
        label: 'Baja',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: AlertTriangle,
        message: 'La calidad es baja. Por favor, retoma la foto siguiendo las recomendaciones.'
      };
    }
  };

  const quality = getQualityInfo(confidenceScore);
  const QualityIcon = quality.icon;
  const scorePercentage = Math.round(confidenceScore * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Confirma tu Foto
        </h3>
        <p className="text-sm text-gray-600">
          Revisa la calidad antes de continuar
        </p>
      </div>

      {/* Photo Preview */}
      <div className="relative">
        <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-100">
          <img
            src={photoUrl}
            alt="Captura facial"
            className="w-full h-auto"
          />
          
          {/* Overlay with detection indicator */}
          <div className="absolute top-4 right-4">
            <div className={`${quality.bgColor} ${quality.borderColor} border-2 rounded-full px-3 py-1.5 flex items-center space-x-2 shadow-lg backdrop-blur-sm`}>
              <div className={`w-2 h-2 ${quality.color.replace('text-', 'bg-')} rounded-full animate-pulse`} />
              <span className={`text-xs font-semibold ${quality.color}`}>
                Rostro detectado
              </span>
            </div>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
      </div>

      {/* Quality Score */}
      <div className={`${quality.bgColor} ${quality.borderColor} border rounded-xl p-4`}>
        <div className="flex items-start space-x-3">
          <QualityIcon size={24} className={`${quality.color} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-800">
                Calidad de Detección: {quality.label}
              </span>
              <span className={`font-bold ${quality.color} text-lg`}>
                {scorePercentage}%
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  confidenceScore >= 0.9
                    ? 'bg-green-500'
                    : confidenceScore >= 0.75
                    ? 'bg-blue-500'
                    : confidenceScore >= 0.6
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
            
            <p className="text-sm text-gray-700 leading-relaxed">
              {quality.message}
            </p>
          </div>
        </div>
      </div>

      {/* Detection Details */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h4 className="font-semibold text-gray-800 mb-3 text-sm">
          Detalles de la Detección
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Iluminación</span>
              {confidenceScore >= 0.8 ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <AlertTriangle size={14} className="text-yellow-500" />
              )}
            </div>
            <p className="text-sm font-semibold text-gray-800">
              {confidenceScore >= 0.8 ? 'Óptima' : 'Mejorable'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Centrado</span>
              {confidenceScore >= 0.7 ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <AlertTriangle size={14} className="text-yellow-500" />
              )}
            </div>
            <p className="text-sm font-semibold text-gray-800">
              {confidenceScore >= 0.7 ? 'Correcto' : 'Ajustar'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Nitidez</span>
              {confidenceScore >= 0.85 ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <AlertTriangle size={14} className="text-yellow-500" />
              )}
            </div>
            <p className="text-sm font-semibold text-gray-800">
              {confidenceScore >= 0.85 ? 'Excelente' : 'Suficiente'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Distancia</span>
              {confidenceScore >= 0.75 ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <AlertTriangle size={14} className="text-yellow-500" />
              )}
            </div>
            <p className="text-sm font-semibold text-gray-800">
              {confidenceScore >= 0.75 ? 'Adecuada' : 'Acercar'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRetake}
          className="flex-1 py-4 px-6 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2 shadow-md"
        >
          <RotateCcw size={20} />
          <span>Retomar Foto</span>
        </button>
        
        <button
          onClick={onConfirm}
          disabled={confidenceScore < 0.6}
          className={`flex-1 py-4 px-6 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 shadow-lg ${
            confidenceScore >= 0.6
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Check size={20} />
          <span>Confirmar y Continuar</span>
        </button>
      </div>

      {/* Helper text */}
      {confidenceScore < 0.6 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs text-red-700 text-center">
            La calidad de la foto es insuficiente. Por favor, retómala siguiendo las recomendaciones
            para obtener mejores resultados.
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoConfirmation;