"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function CreateOrgForm() {
  const router = useRouter();
  const { token } = useAuth(); // 👈 Obtenemos el token del hook

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!token) {
        alert("No hay sesión activa");
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/organization`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } } // 👈 Token JWT directo
      );

      // Recargamos para que el Dashboard detecte el cambio
      window.location.reload();

    } catch (error) {
      console.error(error);
      alert('Error creando la organización.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Registra tu Empresa
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 outline-none text-gray-800"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industria</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 outline-none text-gray-800"
              value={formData.industry}
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
            >
              <option value="">Selecciona...</option>
              <option value="software">Software</option>
              <option value="banca">Banca</option>
              <option value="salud">Salud</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 outline-none text-gray-800"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Guardar y Continuar'}
          </button>
        </div>
      </form>
    </div>
  );
}
