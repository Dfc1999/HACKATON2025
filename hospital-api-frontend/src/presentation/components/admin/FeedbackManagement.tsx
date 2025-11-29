import React, { useState } from 'react';
import { MessageSquare, AlertCircle, Lightbulb, Filter, Send, CheckCircle } from 'lucide-react';

interface Feedback {
  id: string;
  type: 'report' | 'complaint' | 'suggestion';
  title: string;
  description: string;
  submittedBy: string;
  date: string;
  status: 'new' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  response?: string;
}

const FeedbackManagement: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'report' | 'complaint' | 'suggestion'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [responseText, setResponseText] = useState('');

  const feedbackList: Feedback[] = [
    {
      id: '1',
      type: 'report',
      title: 'Error en identificación facial',
      description: 'El sistema no pudo identificar a un paciente con buena iluminación',
      submittedBy: 'Dr. Carlos Méndez',
      date: '2025-11-26',
      status: 'new',
      priority: 'high'
    },
    {
      id: '2',
      type: 'suggestion',
      title: 'Añadir filtro por grupo sanguíneo',
      description: 'Sería útil poder filtrar pacientes por grupo sanguíneo en búsquedas',
      submittedBy: 'Dra. María López',
      date: '2025-11-25',
      status: 'in_progress',
      priority: 'medium',
      assignedTo: 'Admin Juan'
    },
    {
      id: '3',
      type: 'complaint',
      title: 'Proceso de registro muy lento',
      description: 'El registro de pacientes toma más de 5 minutos',
      submittedBy: 'Enfermera Ana Pérez',
      date: '2025-11-24',
      status: 'resolved',
      priority: 'medium',
      assignedTo: 'Admin Pedro',
      response: 'Se optimizó el proceso. Ahora toma menos de 2 minutos.'
    }
  ];

  const filteredFeedback = feedbackList.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'report': return <AlertCircle size={20} className="text-red-600" />;
      case 'complaint': return <MessageSquare size={20} className="text-orange-600" />;
      case 'suggestion': return <Lightbulb size={20} className="text-yellow-600" />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'report': return 'Reporte';
      case 'complaint': return 'Queja';
      case 'suggestion': return 'Sugerencia';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Nuevo</span>;
      case 'in_progress':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">En Proceso</span>;
      case 'resolved':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Resuelto</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Alta</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Media</span>;
      case 'low':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">Baja</span>;
      default:
        return null;
    }
  };

  const handleSendResponse = () => {
    if (selectedFeedback && responseText.trim()) {
      alert('Respuesta enviada exitosamente');
      setResponseText('');
      setSelectedFeedback(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Feedback</h2>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Type Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <div className="flex flex-wrap gap-2">
              {['all', 'report', 'complaint', 'suggestion'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type === 'all' ? 'Todos' : getTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <div className="flex flex-wrap gap-2">
              {['all', 'new', 'in_progress', 'resolved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status === 'all' ? 'Todos' : status === 'new' ? 'Nuevos' : status === 'in_progress' ? 'En Proceso' : 'Resueltos'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFeedback.map((feedback) => (
          <div
            key={feedback.id}
            onClick={() => setSelectedFeedback(feedback)}
            className={`bg-white rounded-xl shadow-lg p-4 md:p-6 cursor-pointer transition-all hover:shadow-xl border-2 ${
              selectedFeedback?.id === feedback.id ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getTypeIcon(feedback.type)}
                <div>
                  <h3 className="font-semibold text-gray-800">{feedback.title}</h3>
                  <p className="text-xs text-gray-600">{feedback.submittedBy}</p>
                </div>
              </div>
              {getStatusBadge(feedback.status)}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">{feedback.description}</p>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">{feedback.date}</span>
              <div className="flex items-center space-x-2">
                {getPriorityBadge(feedback.priority)}
                {feedback.assignedTo && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                    {feedback.assignedTo}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFeedback.length === 0 && (
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <Filter size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No se encontraron registros
          </h3>
          <p className="text-gray-600 text-sm">
            Intenta cambiar los filtros
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full md:max-w-2xl md:rounded-2xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 rounded-t-3xl md:rounded-t-2xl">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3 flex-1">
                  {getTypeIcon(selectedFeedback.type)}
                  <h3 className="text-xl font-bold text-gray-800">{selectedFeedback.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusBadge(selectedFeedback.status)}
                {getPriorityBadge(selectedFeedback.priority)}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-6 space-y-6">
              {/* Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Enviado por:</span>
                  <span className="font-semibold text-gray-800">{selectedFeedback.submittedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-semibold text-gray-800">{selectedFeedback.date}</span>
                </div>
                {selectedFeedback.assignedTo && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Asignado a:</span>
                    <span className="font-semibold text-gray-800">{selectedFeedback.assignedTo}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Descripción</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{selectedFeedback.description}</p>
              </div>

              {/* Previous Response */}
              {selectedFeedback.response && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle size={18} className="text-green-600" />
                    <h4 className="font-semibold text-green-800">Respuesta</h4>
                  </div>
                  <p className="text-sm text-green-700">{selectedFeedback.response}</p>
                </div>
              )}

              {/* Response Form */}
              {selectedFeedback.status !== 'resolved' && (
                <div>
                  <label className="block font-semibold text-gray-800 mb-2">
                    Enviar Respuesta
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                  <button
                    onClick={handleSendResponse}
                    className="mt-3 w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Send size={20} />
                    <span>Enviar Respuesta</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;