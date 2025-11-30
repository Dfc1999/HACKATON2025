import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">

      {/* LADO IZQUIERDO: EMPRESAS (Login Propio) */}
      <section className="flex-1 flex flex-col justify-center items-center bg-black text-white p-10 border-r border-gray-800">
        <div className="max-w-md text-center md:text-left">
          <h2 className="text-sm font-bold tracking-widest text-blue-500 uppercase mb-2">Para Reclutadores</h2>
          <h1 className="text-5xl font-bold mb-6">Service Desk RRHH</h1>
          <p className="text-gray-400 mb-8 text-lg">
            Gestiona tus procesos de selección, configura pruebas técnicas con IA y visualiza resultados en tiempo real.
          </p>

          <div className="flex gap-4 flex-col sm:flex-row">
            {/* Botón que lleva a tu nueva página de login */}
            <Link
              href="/login"
              className="w-full bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors text-center"
            >
              Iniciar Sesión
            </Link>

            <Link
              href="/register"
              className="w-full border border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white/10 transition-colors text-center"
            >
              Crear Cuenta
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-600">Powered by NestJS & Azure OpenAI</p>
        </div>
      </section>

      {/* LADO DERECHO: CANDIDATOS (Ahora con dos opciones de link) */}
      <section className="flex-1 flex flex-col justify-center items-center bg-blue-900 text-white p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        <div className="max-w-md text-center relative z-10">
          <h2 className="text-sm font-bold tracking-widest text-blue-200 uppercase mb-2">Para Postulantes</h2>
          <h1 className="text-4xl font-bold mb-6">¿Tienes una prueba pendiente o quieres aplicar?</h1>
          <p className="text-blue-100 mb-8 text-lg">
            Usa el enlace de postulación o ingresa a tu portal para ver el seguimiento de tu aplicación.
          </p>

          <div className="flex gap-4 flex-col sm:flex-row">
            {/* OPCIÓN 1: Postular (Nueva Ruta de flujo de email) */}
            <Link
              href="/apply"
              className="inline-block w-full bg-white text-blue-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Postular a una Vacante →
            </Link>

            {/* OPCIÓN 2: Ver Seguimiento (Antigua Ruta del Portal) */}
            <Link
              href="/portal-candidate"
              className="inline-block w-full bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-blue-900 transition-all"
            >
              Realizar Prueba →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
