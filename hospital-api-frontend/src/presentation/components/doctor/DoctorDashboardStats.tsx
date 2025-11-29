
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor: string;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  bgColor,
  iconColor
}) => {
  return (
    <div className={`${bgColor} rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${iconColor} p-3 rounded-xl shadow-md`}>
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${
              trend.isPositive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            <TrendingUp
              size={14}
              className={trend.isPositive ? '' : 'transform rotate-180'}
            />
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl md:text-4xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

import React, { useState } from 'react';
import { Users, Calendar, Scan, TrendingUp, Activity } from 'lucide-react';
import CameraCapture from '../shared/CameraCapture.tsx';
import Modal from '../shared/Modal.tsx';
import useFacialRecognition from '../../hooks/useFacialRecognition.ts';

const DoctorDashboardStats: React.FC = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [identifiedDoctor, setIdentifiedDoctor] = useState<{
    nombre: string;
    familiares: number;
    enfermedadesBase: string[];
    foto: string;
  } | null>(null);

  const { initializeFaceAPI } = useFacialRecognition();

  const handleOpenCamera = async () => {
    try {
      await initializeFaceAPI();
      setShowCamera(true);
    } catch (error) {
      console.error('Error al inicializar reconocimiento facial:', error);
    }
  };

  const handleCapture = (photo: string) => {
    setShowCamera(false);
    const mockDoctor = {
      nombre: 'Dr. Juan Pérez',
      familiares: 3,
      enfermedadesBase: ['Hipertensión', 'Diabetes tipo II'],
      foto: photo,
    };
    setIdentifiedDoctor(mockDoctor);
    setShowResultModal(true);
  };

  const handleCancelCamera = () => setShowCamera(false);
  const handleCloseModal = () => setShowResultModal(false);

  const stats = [
    {
      title: 'Registros Totales',
      value: '2,847',
      icon: <Users size={24} className="text-white" />,
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconColor: 'bg-blue-600',
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Citas Hoy',
      value: '18',
      icon: <Calendar size={24} className="text-white" />,
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      iconColor: 'bg-purple-600',
      trend: { value: 5, isPositive: true }
    },
    {
      title: 'Identificaciones (24h)',
      value: '42',
      icon: <Scan size={24} className="text-white" />,
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      iconColor: 'bg-green-600',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Tasa de Éxito',
      value: '98.5%',
      icon: <Activity size={24} className="text-white" />,
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600',
      iconColor: 'bg-orange-600',
      trend: { value: 2, isPositive: true }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions Card */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Acceso Rápido
            </h3>
            <p className="text-sm text-gray-600">
              Identifica pacientes o agenda citas de forma inmediata
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={handleOpenCamera}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md"
            >
              <Scan size={20} />
              <span>Identificar Doctor</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-md">
              <Calendar size={20} />
              <span>Nueva Cita</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chart Card - Mobile Optimized */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">
            Tendencia de Identificaciones
          </h3>
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Últimos 7 días</option>
            <option>Últimos 30 días</option>
            <option>Últimos 3 meses</option>
          </select>
        </div>

        {/* Simple Bar Chart - Mobile Friendly */}
        <div className="space-y-3">
          {[
            { day: 'Lun', value: 32, percentage: 75 },
            { day: 'Mar', value: 45, percentage: 100 },
            { day: 'Mié', value: 38, percentage: 85 },
            { day: 'Jue', value: 42, percentage: 93 },
            { day: 'Vie', value: 51, percentage: 100 },
            { day: 'Sáb', value: 28, percentage: 62 },
            { day: 'Dom', value: 18, percentage: 40 }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-600 w-10">
                {item.day}
              </span>
              <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                >
                  <span className="text-white text-xs font-semibold">
                    {item.value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Promedio Diario</p>
              <p className="text-xl font-bold text-gray-800">36</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Pico Máximo</p>
              <p className="text-xl font-bold text-gray-800">51</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Día Más Activo</p>
              <p className="text-xl font-bold text-gray-800">Vie</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Total Semanal</p>
              <p className="text-xl font-bold text-gray-800">254</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Actividad Reciente
        </h3>
        <div className="space-y-3">
          {[
            {
              type: 'identification',
              patient: 'María González',
              time: 'Hace 5 min',
              icon: Scan,
              color: 'text-blue-600 bg-blue-50'
            },
            {
              type: 'appointment',
              patient: 'Carlos Pérez',
              time: 'Hace 15 min',
              icon: Calendar,
              color: 'text-purple-600 bg-purple-50'
            },
            {
              type: 'identification',
              patient: 'Ana Rodríguez',
              time: 'Hace 23 min',
              icon: Scan,
              color: 'text-blue-600 bg-blue-50'
            }
          ].map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className={`p-2 rounded-lg ${activity.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {activity.patient}
                  </p>
                  <p className="text-xs text-gray-600">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showCamera && (
        <Modal
          isOpen={showCamera}
          onClose={handleCancelCamera}
          title="Captura Facial del Doctor"
          size="large"
        >
          <CameraCapture onCapture={(photo) => handleCapture(photo)} onCancel={handleCancelCamera} />
        </Modal>
      )}

      {showResultModal && identifiedDoctor && (
        <Modal
          isOpen={showResultModal}
          onClose={handleCloseModal}
          title="Doctor Identificado"
          size="medium"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <img
              src={identifiedDoctor.foto}
              alt="Doctor identificado"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />
            <h3 className="text-xl font-bold text-gray-800">{identifiedDoctor.nombre}</h3>
            <p className="text-gray-600">
              <strong>Familiares:</strong> {identifiedDoctor.familiares}
            </p>
            <p className="text-gray-600">
              <strong>Enfermedades de base:</strong>{' '}
              {identifiedDoctor.enfermedadesBase.join(', ')}
            </p>
            <button
              onClick={handleCloseModal}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DoctorDashboardStats;