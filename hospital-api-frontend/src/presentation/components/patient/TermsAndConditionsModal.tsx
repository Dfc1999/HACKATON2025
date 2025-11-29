import React, { useState, useRef, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';

interface TermsAndConditionsModalProps {
  onAccept: () => void;
  onClose: () => void;
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  onAccept,
  onClose
}) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [acceptCheckbox, setAcceptCheckbox] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const threshold = 50;
      
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        setHasScrolledToBottom(true);
      }
    }
  };

  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll);
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleAccept = () => {
    if (hasScrolledToBottom && acceptCheckbox) {
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black bg-opacity-50 p-0 md:p-4">
      <div className="bg-white w-full md:max-w-3xl md:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white md:rounded-t-2xl rounded-t-3xl">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Términos y Condiciones
            </h2>
            <p className="text-sm text-gray-600 mt-1">Versión 1.0 - Noviembre 2025</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6"
        >
          {/* Scroll Indicator */}
          {!hasScrolledToBottom && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-blue-800">
                Debes desplazarte hasta el final del documento para poder aceptar los términos
              </p>
            </div>
          )}

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              1. Aceptación de Términos
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Al registrarse en nuestro sistema de identificación facial médica, usted acepta estos
              términos y condiciones en su totalidad. Si no está de acuerdo con alguna parte de estos
              términos, no debe usar nuestros servicios.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              2. Uso de Datos Biométricos
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Nuestro sistema utiliza tecnología de reconocimiento facial para crear un perfil
              biométrico único basado en las características de su rostro. Esta información se
              utilizará exclusivamente para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 text-sm md:text-base">
              <li>Identificación rápida en contextos médicos de emergencia</li>
              <li>Acceso seguro a su historial médico por personal autorizado</li>
              <li>Prevención de errores de identificación en procedimientos médicos</li>
              <li>Mejora de la seguridad y eficiencia en la atención médica</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              3. Protección de Datos Personales
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Nos comprometemos a proteger su información personal y datos biométricos de acuerdo con
              las leyes de protección de datos aplicables. Sus datos serán:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 text-sm md:text-base">
              <li>Encriptados en tránsito y en reposo</li>
              <li>Almacenados en servidores seguros con acceso restringido</li>
              <li>Nunca compartidos con terceros sin su consentimiento explícito</li>
              <li>Eliminados de manera segura si solicita la baja del servicio</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              4. Derechos del Usuario
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Usted tiene derecho a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 text-sm md:text-base">
              <li>Acceder a sus datos personales almacenados en cualquier momento</li>
              <li>Solicitar la corrección de información incorrecta o desactualizada</li>
              <li>Solicitar la eliminación de sus datos (derecho al olvido)</li>
              <li>Retirar su consentimiento en cualquier momento</li>
              <li>Presentar quejas ante la autoridad de protección de datos</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              5. Responsabilidades del Usuario
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Al usar este servicio, usted se compromete a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 text-sm md:text-base">
              <li>Proporcionar información veraz y actualizada</li>
              <li>Notificar cambios significativos en su apariencia física</li>
              <li>Mantener la confidencialidad de sus credenciales de acceso</li>
              <li>Informar inmediatamente sobre cualquier uso no autorizado</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              6. Limitación de Responsabilidad
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Si bien implementamos las mejores prácticas de seguridad, ningún sistema es
              completamente infalible. No nos hacemos responsables por:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 text-sm md:text-base">
              <li>Fallos en la identificación debido a cambios significativos en su apariencia</li>
              <li>Interrupciones del servicio por causas de fuerza mayor</li>
              <li>Daños derivados del uso indebido del sistema por terceros</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              7. Modificaciones del Servicio
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Nos reservamos el derecho de modificar o descontinuar el servicio en cualquier momento.
              Le notificaremos con al menos 30 días de anticipación sobre cambios significativos que
              afecten sus derechos.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              8. Jurisdicción y Ley Aplicable
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Estos términos se rigen por las leyes de Bolivia. Cualquier disputa será resuelta en los
              tribunales competentes de La Paz, Bolivia.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              9. Contacto
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Para consultas sobre estos términos o sobre el tratamiento de sus datos, puede
              contactarnos en: privacidad@sistema-medico.bo
            </p>
          </section>

          {/* End marker */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600 italic">
              Fin del documento
            </p>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50 md:rounded-b-2xl">
          <label className="flex items-start space-x-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={acceptCheckbox}
              onChange={(e) => setAcceptCheckbox(e.target.checked)}
              disabled={!hasScrolledToBottom}
              className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span
              className={`text-sm flex-1 ${
                hasScrolledToBottom ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              He leído y acepto todos los términos y condiciones descritos anteriormente, incluyendo
              el procesamiento de mis datos biométricos para fines médicos
            </span>
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAccept}
              disabled={!hasScrolledToBottom || !acceptCheckbox}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Check size={20} className="mr-2" />
              Aceptar y Continuar
            </button>
          </div>

          {!hasScrolledToBottom && (
            <p className="text-xs text-center text-gray-500 mt-3">
              Desplázate hasta el final para habilitar la aceptación
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;