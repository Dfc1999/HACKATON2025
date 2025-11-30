"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CandidateLogin() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      router.push(`/exam?email=${encodeURIComponent(email)}`);
    } else {
      alert("Por favor ingresa un correo electrónico válido.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="text-center max-w-2xl w-full">
        {/* Un pequeño link para volver al inicio */}
        <a href="/" className="absolute top-6 left-6 text-sm text-gray-400 hover:text-white">
          ← Volver al inicio
        </a>

        <h1 className="text-4xl font-bold mb-2 tracking-tight text-blue-400">
          Zona de Postulantes
        </h1>
        <p className="text-lg text-gray-300 mb-10">
          Ingresa tu correo para iniciar tu evaluación técnica.
        </p>

        <div className="p-8 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm shadow-2xl max-w-md mx-auto">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="text-left">
              <label htmlFor="email" className="block text-xs text-gray-400 mb-1 ml-1">
                Correo registrado en tu CV
              </label>
              <input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/50 border border-gray-600 text-white focus:border-blue-500 focus:outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-blue-900/20"
            >
              Comenzar Prueba 🚀
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
