"use client";
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link'; // Importado para el enlace de "Ya tienes cuenta"

export default function RegisterPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(''); // Añadido para manejo de errores

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, form);
      login(res.data.access_token, res.data.user);
    } catch (err: any) { // Usamos 'any' para manejar el error de axios
      setError(err.response?.data?.message || 'Error al registrarse. Intenta con otro Email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Registro Reclutador
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Nombre Completo"
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 outline-none text-gray-800"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 outline-none text-gray-800"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 outline-none text-gray-800"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 transition text-white p-3 rounded-lg font-semibold"
        >
          Crear Cuenta
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          ¿Ya tienes cuenta? <Link href="/login" className="text-blue-600 font-medium">Inicia Sesión</Link>
        </p>
      </form>
    </div>
  );
}
