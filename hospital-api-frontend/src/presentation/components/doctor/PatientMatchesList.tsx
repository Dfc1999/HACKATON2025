import React from 'react';
import { Check, User } from 'lucide-react';

interface PatientMatch {
  id: string;
  name: string;
  dni: string;
  similarity: number;
  photoUrl?: string;
  age: number;
  bloodType: string;
}

interface PatientMatchesListProps {
  matches: PatientMatch[] ;
  onSelectMatch: (patientId: string) => void;
  selectedMatchId?: string;
  isLoading?: boolean;
}

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border-2 border-gray-200 p-4 animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="w-16 h-16 bg-gray-300 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-300 rounded w-1/2" />
      </div>
    </div>
  </div>
);

const PatientMatchesList: React.FC<PatientMatchesListProps> = ({
  matches,
  onSelectMatch,
  selectedMatchId,
  isLoading = false
}) => {
  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.95) return 'text-green-600 bg-green-50 border-green-200';
    if (similarity >= 0.85) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (similarity >= 0.75) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getSimilarityLabel = (similarity: number) => {
    if (similarity >= 0.95) return 'Muy Alta';
    if (similarity >= 0.85) return 'Alta';
    if (similarity >= 0.75) return 'Media';
    return 'Baja';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-300 rounded w-40 animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={40} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No se encontraron coincidencias
        </h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          El sistema no pudo identificar al paciente. Intenta con mejor iluminación o búsqueda por DNI.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-800">
          Coincidencias Encontradas
        </h3>
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {matches.length} resultados
        </span>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-xs text-blue-800">
          Selecciona el paciente correcto. Las coincidencias están ordenadas por similitud.
        </p>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {matches.map((match) => {
          const isSelected = selectedMatchId === match.id;
          const similarityColor = getSimilarityColor(match.similarity);
          const similarityLabel = getSimilarityLabel(match.similarity);
          const similarityPercentage = Math.round(match.similarity * 100);

          return (
            <button
              key={match.id}
              onClick={() => onSelectMatch(match.id)}
              className={`relative bg-white rounded-xl border-2 p-4 text-left transition-all hover:shadow-lg ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1 shadow-lg">
                  <Check size={16} />
                </div>
              )}

              {/* Photo and basic info */}
              <div className="flex items-start space-x-3 mb-3">
                <div className="relative shrink-0">
                  {match.photoUrl ? (
                    <img
                      src={match.photoUrl}
                      alt={match.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-gray-200">
                      {match.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  
                  {/* Similarity badge on photo */}
                  <div className={`absolute -bottom-1 -right-1 ${similarityColor} border-2 rounded-full px-1.5 py-0.5 text-xs font-bold`}>
                    {similarityPercentage}%
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate mb-1">
                    {match.name}
                  </h4>
                  <p className="text-xs text-gray-600">
                    DNI: {match.dni}
                  </p>
                </div>
              </div>

              {/* Additional info */}
              <div className="space-y-2">
                {/* Similarity indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Similitud:</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${similarityColor}`}>
                    {similarityLabel}
                  </span>
                </div>

                {/* Patient details */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{match.age} años</span>
                  <span className="font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                    {match.bloodType}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      match.similarity >= 0.95
                        ? 'bg-green-500'
                        : match.similarity >= 0.85
                        ? 'bg-blue-500'
                        : match.similarity >= 0.75
                        ? 'bg-yellow-500'
                        : 'bg-orange-500'
                    }`}
                    style={{ width: `${similarityPercentage}%` }}
                  />
                </div>
              </div>

              {/* Selection indicator text */}
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-700 font-medium text-center">
                    ✓ Seleccionado
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Best match recommendation */}
      {matches?.length > 0 && (matches[0]?.similarity ?? 0) >= 0.95 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
          <div className="flex items-start space-x-2">
            <Check className="text-green-600 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-green-800">
              <span className="font-semibold">Recomendación:</span> El primer resultado tiene una
              similitud muy alta ({Math.round((matches[0]?.similarity ?? 0) * 100)}%). Es muy probable que
              sea el paciente correcto.
            </p>
          </div>
        </div>
      )}

      {/* Warning for low similarity */}
      {matches?.length > 0 && (matches[0]?.similarity ?? 0) < 0.75 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs text-yellow-800">
              <span className="font-semibold">Precaución:</span> La similitud es baja. Verifica
              cuidadosamente la identidad antes de proceder o intenta una nueva captura.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientMatchesList;