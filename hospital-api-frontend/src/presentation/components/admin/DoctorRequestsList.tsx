import React, { useState } from 'react';
import { Eye, Check, X, Filter, Search, Clock, CheckCircle, XCircle } from 'lucide-react';

interface DoctorRequest {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  email: string;
  phone: string;
}

interface DoctorRequestsListProps {
  onViewDetails: (requestId: string) => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const DoctorRequestsList: React.FC<DoctorRequestsListProps> = ({
  onViewDetails,
  onApprove,
  onReject
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mockRequests: DoctorRequest[] = [
    {
      id: '1',
      name: 'Dr. Carlos Mendoza',
      specialty: 'Cardiología',
      hospital: 'Hospital del Tórax',
      requestDate: '2025-11-25',
      status: 'pending',
      email: 'cmendoza@hospital.bo',
      phone: '70123456'
    },
    {
      id: '2',
      name: 'Dra. María López',
      specialty: 'Pediatría',
      hospital: 'Hospital del Niño',
      requestDate: '2025-11-24',
      status: 'pending',
      email: 'mlopez@hospital.bo',
      phone: '71234567'
    },
    {
      id: '3',
      name: 'Dr. Juan Pérez',
      specialty: 'Medicina General',
      hospital: 'Clínica Sur',
      requestDate: '2025-11-20',
      status: 'approved',
      email: 'jperez@clinica.bo',
      phone: '72345678'
    }
  ];

  const filteredRequests = mockRequests.filter(req => {
    const matchesFilter = filter === 'all' || req.status === filter;
    const matchesSearch = 
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <Clock size={12} />
            <span>Pendiente</span>
          </span>
        );
      case 'approved':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle size={12} />
            <span>Aprobado</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <XCircle size={12} />
            <span>Rechazado</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Solicitudes de Doctores
        </h2>
        <div className="flex items-center space-x-2">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f as any);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendientes' : f === 'approved' ? 'Aprobados' : 'Rechazados'}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Buscar por nombre, especialidad u hospital..."
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Especialidad</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Hospital</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{request.name}</div>
                    <div className="text-sm text-gray-600">{request.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{request.specialty}</td>
                  <td className="px-6 py-4 text-gray-700">{request.hospital}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{request.requestDate}</td>
                  <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewDetails(request.id)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onApprove(request.id)}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            title="Aprobar"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => onReject(request.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Rechazar"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginatedRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl shadow-lg p-4 border-2 border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{request.name}</h3>
                <p className="text-sm text-gray-600">{request.specialty}</p>
              </div>
              {getStatusBadge(request.status)}
            </div>
            
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Hospital:</span>
                <span className="font-medium text-gray-800">{request.hospital}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-medium text-gray-800">{request.requestDate}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onViewDetails(request.id)}
                className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition-colors"
              >
                <Eye size={18} />
                <span>Ver</span>
              </button>
              {request.status === 'pending' && (
                <>
                  <button
                    onClick={() => onApprove(request.id)}
                    className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-green-100 text-green-600 rounded-lg font-medium hover:bg-green-200 transition-colors"
                  >
                    <Check size={18} />
                    <span>Aprobar</span>
                  </button>
                  <button
                    onClick={() => onReject(request.id)}
                    className="px-4 py-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Empty state */}
      {filteredRequests.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Filter size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No se encontraron solicitudes
          </h3>
          <p className="text-gray-600 text-sm">
            Intenta cambiar los filtros o la búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorRequestsList;