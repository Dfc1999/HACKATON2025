import React from 'react';
import { Users, Calendar, Scan, TrendingUp, Activity } from 'lucide-react';

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
    <div className={`${bgColor} rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-teal-100`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${iconColor} p-3 rounded-xl shadow-sm`}>
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center space-x-1 text-sm font-semibold px-3 py-1.5 rounded-full ${
              trend.isPositive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
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
      <h3 className="text-slate-600 text-sm font-semibold mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-4xl font-bold text-slate-800">{value}</p>
    </div>
  );
};

const DoctorDashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Registros Totales',
      value: '2,847',
      icon: <Users size={24} className="text-white" />,
      bgColor: 'bg-gradient-to-br from-white to-teal-50',
      iconColor: 'bg-gradient-to-br from-teal-500 to-teal-600',
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Citas Hoy',
      value: '18',
      icon: <Calendar size={24} className="text-white" />,
      bgColor: 'bg-gradient-to-br from-white to-cyan-50',
      iconColor: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      trend: { value: 5, isPositive: true }
    },
    {
      title: 'Identificaciones (24h)',
      value: '42',
      icon: <Scan size={24} className="text-white" />,
      bgColor: 'bg-gradient-to-br from-white to-emerald-50',
      iconColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Tasa de Éxito',
      value: '98.5%',
      icon: <Activity size={24} className="text-white" />,
      bgColor: 'bg-gradient-to-br from-white to-sky-50',
      iconColor: 'bg-gradient-to-br from-sky-500 to-sky-600',
      trend: { value: 2, isPositive: true }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-teal-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Médico</h1>
              <p className="text-slate-600">Hospital Nexus - Bienvenido Dr. García</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl shadow-md">
              <Activity size={20} />
              <span className="font-semibold">Sistema Activo</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-teal-100">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-3"></span>
                Acceso Rápido
              </h3>
              <p className="text-sm text-slate-600 ml-4">
                Identifica pacientes o agenda citas de forma inmediata
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <Scan size={20} />
                <span>Identificar Paciente</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <Calendar size={20} />
                <span>Nueva Cita</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chart Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-teal-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-3"></span>
              Tendencia de Identificaciones
            </h3>
            <select className="text-sm border-2 border-teal-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-slate-700 font-medium">
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
              <option>Últimos 3 meses</option>
            </select>
          </div>

          {/* Bar Chart */}
          <div className="space-y-4">
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
                <span className="text-sm font-bold text-slate-700 w-12">
                  {item.day}
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-10 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-500 h-full rounded-full flex items-center justify-end pr-4 transition-all duration-700 shadow-sm"
                    style={{ width: `${item.percentage}%` }}
                  >
                    <span className="text-white text-sm font-bold drop-shadow-sm">
                      {item.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-6 border-t-2 border-teal-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-white rounded-xl border border-teal-100">
                <p className="text-xs text-slate-600 mb-2 font-semibold uppercase tracking-wide">Promedio Diario</p>
                <p className="text-2xl font-bold text-teal-700">36</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-white rounded-xl border border-cyan-100">
                <p className="text-xs text-slate-600 mb-2 font-semibold uppercase tracking-wide">Pico Máximo</p>
                <p className="text-2xl font-bold text-cyan-700">51</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100">
                <p className="text-xs text-slate-600 mb-2 font-semibold uppercase tracking-wide">Día Más Activo</p>
                <p className="text-2xl font-bold text-emerald-700">Vie</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-sky-50 to-white rounded-xl border border-sky-100">
                <p className="text-xs text-slate-600 mb-2 font-semibold uppercase tracking-wide">Total Semanal</p>
                <p className="text-2xl font-bold text-sky-700">254</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-teal-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <span className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-3"></span>
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            {[
              {
                type: 'identification',
                patient: 'María González',
                time: 'Hace 5 min',
                icon: Scan,
                color: 'text-teal-600 bg-teal-50 border-teal-200'
              },
              {
                type: 'appointment',
                patient: 'Carlos Pérez',
                time: 'Hace 15 min',
                icon: Calendar,
                color: 'text-cyan-600 bg-cyan-50 border-cyan-200'
              },
              {
                type: 'identification',
                patient: 'Ana Rodríguez',
                time: 'Hace 23 min',
                icon: Scan,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
              }
            ].map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl hover:from-teal-50 hover:to-cyan-50 transition-all duration-300 border border-slate-200 hover:border-teal-200 hover:shadow-md"
                >
                  <div className={`p-3 rounded-xl border ${activity.color} shadow-sm`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {activity.patient}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardStats;