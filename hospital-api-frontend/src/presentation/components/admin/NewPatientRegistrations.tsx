import React, { useState } from 'react';
import { TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

interface RegistrationStats {
  total: number;
  successful: number;
  failed: number;
  change: number;
}

const NewPatientRegistrations: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stats: RegistrationStats = {
    total: 47,
    successful: 44,
    failed: 3,
    change: 12.5
  };

  const recentRegistrations = [
    {
      id: '1',
      name: 'María González',
      dni: '12345678',
      time: 'Hace 5 min',
      status: 'success',
      hospital: 'Hospital del Tórax'
    },
    {
      id: '2',
      name: 'Carlos Pérez',
      dni: '87654321',
      time: 'Hace 15 min',
      status: 'success',
      hospital: 'Clínica Sur'
    },
    {
      id: '3',
      name: 'Ana Rodríguez',
      dni: '11223344',
      time: 'Hace 23 min',
      status: 'failed',
      hospital: 'Hospital del Niño',
      errorReason: 'Calidad facial insuficiente'
    },
    {
      id: '4',
      name: 'Juan Mamani',
      dni: '55667788',
      time: 'Hace 35 min',
      status: 'success',
      hospital: 'Caja Petrolera'
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Registros de Pacientes
        </h2>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Últimas 24h</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Clock size={24} />
            </div>
            <div className={`flex items-center space-x-1 text-sm px-2 py-1 rounded-full ${
              stats.change >= 0 ? 'bg-green-500 bg-opacity-30' : 'bg-red-500 bg-opacity-30'
            }`}>
              {stats.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{Math.abs(stats.change)}%</span>
            </div>
          </div>
          <p className="text-blue-100 text-sm mb-1">Total Registros</p>
          <p className="text-4xl font-bold">{stats.total}</p>
        </div>

        {/* Successful */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Exitosos</p>
          <p className="text-4xl font-bold text-green-600">{stats.successful}</p>
          <p className="text-xs text-gray-500 mt-2">
            {((stats.successful / stats.total) * 100).toFixed(1)}% de éxito
          </p>
        </div>

        {/* Failed */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Fallidos</p>
          <p className="text-4xl font-bold text-red-600">{stats.failed}</p>
          <p className="text-xs text-gray-500 mt-2">
            {((stats.failed / stats.total) * 100).toFixed(1)}% de fallos
          </p>
        </div>

        {/* Success Rate */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-green-100 text-sm mb-1">Tasa de Éxito</p>
          <p className="text-4xl font-bold">
            {((stats.successful / stats.total) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Registros Recientes</h3>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">DNI</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Hospital</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Hora</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{reg.name}</td>
                  <td className="px-6 py-4 text-gray-700">{reg.dni}</td>
                  <td className="px-6 py-4 text-gray-700">{reg.hospital}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{reg.time}</td>
                  <td className="px-6 py-4">
                    {reg.status === 'success' ? (
                      <span className="flex items-center space-x-1 text-green-600">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">Exitoso</span>
                      </span>
                    ) : (
                      <div>
                        <span className="flex items-center space-x-1 text-red-600 mb-1">
                          <XCircle size={16} />
                          <span className="text-sm font-medium">Fallido</span>
                        </span>
                        {reg.errorReason && (
                          <p className="text-xs text-gray-600">{reg.errorReason}</p>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {recentRegistrations.map((reg) => (
            <div key={reg.id} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{reg.name}</h4>
                  <p className="text-sm text-gray-600">DNI: {reg.dni}</p>
                </div>
                {reg.status === 'success' ? (
                  <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <CheckCircle size={14} />
                    <span>Exitoso</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    <XCircle size={14} />
                    <span>Fallido</span>
                  </span>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-gray-700">
                  <span className="font-medium">Hospital:</span> {reg.hospital}
                </p>
                <p className="text-gray-600">{reg.time}</p>
                {reg.errorReason && (
                  <p className="text-red-600 text-xs mt-2">
                    <span className="font-medium">Error:</span> {reg.errorReason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Failure Analysis */}
      {stats.failed > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Análisis de Fallos</h3>
          <div className="space-y-3">
            {[
              { reason: 'Calidad facial insuficiente', count: 2, percentage: 66.7 },
              { reason: 'Datos incompletos', count: 1, percentage: 33.3 }
            ].map((failure, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">{failure.reason}</span>
                  <span className="text-sm font-bold text-gray-700">{failure.count} casos</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${failure.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPatientRegistrations;