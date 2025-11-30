"use client";

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // 👈 Importar contexto

export default function DocumentUploader() {
  const { token } = useAuth(); // 👈 Usar token del contexto
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Selecciona un archivo");
    if (!token) return alert("No estás autenticado");

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/upload-master`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Header simple
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert(`✅ Archivo subido: ${response.data.message}`);
    } catch (error) {
      console.error(error);
      alert("Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm mt-8">
      <h3 className="font-bold mb-4 text-gray-800">Cargar Reglas del Examen (PDF/Word)</h3>
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-500 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {uploading ? 'Subiendo a Azure...' : 'Subir Documento'}
      </button>
    </div>
  );
}
