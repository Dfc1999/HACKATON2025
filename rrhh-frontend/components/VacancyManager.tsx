"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Vacancy {
  _id: string;
  codigo_vacante: string;
  titulo: string;
  requisitos_texto: string;
  estado: 'activa' | 'pausada' | 'cerrada';
  createdAt: string;
}

export default function VacancyManager() {
  const { token } = useAuth();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    codigo_vacante: '',
    titulo: '',
    requisitos_texto: ''
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Cargar vacantes
  useEffect(() => {
    loadVacancies();
  }, []);

  const loadVacancies = async () => {
    try {
      const response = await axios.get(`${apiUrl}/vacancies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVacancies(response.data);
    } catch (error) {
      console.error('Error cargando vacantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Actualizar
        await axios.put(
          `${apiUrl}/vacancies/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Crear nueva
        await axios.post(
          `${apiUrl}/vacancies`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Reset y recargar
      setFormData({ codigo_vacante: '', titulo: '', requisitos_texto: '' });
      setShowForm(false);
      setEditingId(null);
      loadVacancies();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error al guardar la vacante';
      alert(msg);
    }
  };

  const handleEdit = (vacancy: Vacancy) => {
    setFormData({
      codigo_vacante: vacancy.codigo_vacante,
      titulo: vacancy.titulo,
      requisitos_texto: vacancy.requisitos_texto
    });
    setEditingId(vacancy._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta vacante?')) return;

    try {
      await axios.delete(`${apiUrl}/vacancies/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadVacancies();
    } catch (error) {
      alert('Error al eliminar la vacante');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'activa' | 'pausada' | 'cerrada') => {
    try {
      await axios.put(
        `${apiUrl}/vacancies/${id}/status`,
        { estado: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadVacancies();
    } catch (error) {
      alert('Error al cambiar el estado');
    }
  };

  const cancelEdit = () => {
    setFormData({ codigo_vacante: '', titulo: '', requisitos_texto: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activa': return 'bg-green-100 text-green-800';
      case 'pausada': return 'bg-yellow-100 text-yellow-800';
      case 'cerrada': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Cargando vacantes...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Vacantes</h2>
          <p className="text-sm text-gray-600 mt-1">
            Estas vacantes serán procesadas automáticamente por Logic Apps
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {showForm ? '✕ Cancelar' : '+ Nueva Vacante'}
        </button>
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {editingId ? 'Editar Vacante' : 'Nueva Vacante'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de Vacante *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: TEST-JAVA"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.codigo_vacante}
                onChange={(e) => setFormData({ ...formData, codigo_vacante: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título del Puesto *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Desarrollador Java Junior"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requisitos Técnicos *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Ej: Experiencia mínima de 1 año en Java. Conocimiento de Spring Boot. Inglés Básico."
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.requisitos_texto}
                onChange={(e) => setFormData({ ...formData, requisitos_texto: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Estos requisitos serán usados por la IA para generar exámenes personalizados
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {editingId ? '💾 Actualizar' : '✓ Crear Vacante'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LISTA DE VACANTES */}
      {vacancies.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No hay vacantes registradas</p>
          <p className="text-gray-400 text-sm mt-2">Crea tu primera vacante para comenzar</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {vacancies.map((vacancy) => (
            <div
              key={vacancy._id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{vacancy.titulo}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(vacancy.estado)}`}>
                      {vacancy.estado.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Código:</strong> {vacancy.codigo_vacante}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {vacancy.requisitos_texto}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Creada: {new Date(vacancy.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <select
                  value={vacancy.estado}
                  onChange={(e) => handleStatusChange(vacancy._id, e.target.value as any)}
                  className="text-sm border rounded px-3 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="activa">Activa</option>
                  <option value="pausada">Pausada</option>
                  <option value="cerrada">Cerrada</option>
                </select>

                <button
                  onClick={() => handleEdit(vacancy)}
                  className="text-sm bg-gray-100 text-gray-700 px-4 py-1 rounded hover:bg-gray-200 transition-colors"
                >
                  ✏️ Editar
                </button>

                <button
                  onClick={() => handleDelete(vacancy._id)}
                  className="text-sm bg-red-100 text-red-700 px-4 py-1 rounded hover:bg-red-200 transition-colors"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
