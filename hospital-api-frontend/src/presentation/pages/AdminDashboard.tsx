import React, { useState } from 'react';
import { Menu, X, Users, FileText, MessageSquare, LogOut, Settings, Shield } from 'lucide-react';
import DoctorRequestsList from '../components/admin/DoctorRequestsList.tsx';
import DoctorValidationForm from '../components/admin/DoctorValidationForm.tsx';
import NewPatientRegistrations from '../components/admin/NewPatientRegistrations.tsx';
import FeedbackManagement from '../components/admin/FeedbackManagement.tsx';

type AdminView = 'doctors' | 'patients' | 'feedback' | 'validation';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<AdminView>('doctors');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  const adminUser = {
    name: 'Admin Juan Pérez',
    role: 'Administrador Principal',
    avatar: null
  };

  const handleViewDetails = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setCurrentView('validation');
  };

  const handleApprove = (doctorId: string) => {
    alert(`Doctor ${doctorId} aprobado`);
  };

  const handleReject = (doctorId: string) => {
    alert(`Doctor ${doctorId} rechazado`);
  };

  const handleValidationApprove = (notes: string) => {
    alert('Doctor aprobado: ' + notes);
    setCurrentView('doctors');
    setSelectedDoctorId(null);
  };

  const handleValidationReject = (reason: string) => {
    alert('Doctor rechazado: ' + reason);
    setCurrentView('doctors');
    setSelectedDoctorId(null);
  };

  const handleRequestMore = (message: string) => {
    alert('Solicitar más información: ' + message);
    setCurrentView('doctors');
    setSelectedDoctorId(null);
  };

  const navItems = [
    { id: 'doctors' as AdminView, icon: Users, label: 'Solicitudes de Doctores', badge: 5 },
    { id: 'patients' as AdminView, icon: FileText, label: 'Registros de Pacientes' },
    { id: 'feedback' as AdminView, icon: MessageSquare, label: 'Reportes y Feedback', badge: 3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Shield size={24} className="text-white" />
                </div>
                <span className="font-bold text-gray-800">Admin Panel</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Admin Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {adminUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{adminUser.name}</p>
                <p className="text-xs text-gray-600 truncate">{adminUser.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setSidebarOpen(false);
                    setSelectedDoctorId(null);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={20} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Settings & Logout */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings size={20} />
              <span>Configuración</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={24} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {currentView === 'doctors' && 'Solicitudes de Doctores'}
                  {currentView === 'patients' && 'Registros de Pacientes'}
                  {currentView === 'feedback' && 'Reportes y Feedback'}
                  {currentView === 'validation' && 'Validación de Doctor'}
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Panel de administración
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-700">En línea</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          {currentView === 'doctors' && !selectedDoctorId && (
            <DoctorRequestsList
              onViewDetails={handleViewDetails}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {currentView === 'validation' && selectedDoctorId && (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setCurrentView('doctors');
                  setSelectedDoctorId(null);
                }}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Volver a solicitudes</span>
              </button>
              
              <DoctorValidationForm
                doctorId={selectedDoctorId}
                onApprove={handleValidationApprove}
                onReject={handleValidationReject}
                onRequestMore={handleRequestMore}
              />
            </div>
          )}

          {currentView === 'patients' && <NewPatientRegistrations />}
          {currentView === 'feedback' && <FeedbackManagement />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;