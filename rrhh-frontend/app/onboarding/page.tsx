import CreateOrgForm from '@/components/CreateOrgForm';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-blue-900">
          Bienvenido al Service Desk RRHH
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
           Configura tu organización para empezar.
        </p>
      </div>
      <CreateOrgForm />
    </div>
  );
}
