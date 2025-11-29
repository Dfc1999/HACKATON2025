import { useState } from "react";

interface AgentCard {
  id: number;
  title: string;
  shortDescription: string;
  longDescription: string;
  technicalSpecs: string[];
  demoLink: string;
}

const agents: AgentCard[] = [
  {
    id: 1,
    title: "Agente de Reconocimiento de Personas",
    shortDescription:
      "Identidad sin documentos, seguridad sin esperas – Reconocimiento instantáneo que transforma rostros en acceso, desde conciertos hasta emergencias médicas.",
    longDescription:
      "El Agente de Reconocimiento de Personas revoluciona la forma en que las organizaciones identifican y verifican usuarios en tiempo real. Imagina llegar a un evento masivo sin boletos ni QR, simplemente caminar hasta la entrada y ser reconocido al instante. O más crítico aún: un paciente llega inconsciente a urgencias sin identificación, y en segundos el sistema identifica quién es, recupera su historial médico y notifica a sus contactos de emergencia. Este agente combina inteligencia artificial de visión con bases de datos ultrarrápidas para eliminar la fricción en escenarios cotidianos y salvar tiempo valioso en situaciones de vida o muerte. Pero su verdadero valor reside en su inteligencia ética: cuando detecta inconsistencias o baja confianza, inmediatamente escala a verificación humana, garantizando que la tecnología potencia, pero nunca reemplaza, el juicio humano en decisiones críticas.",
    technicalSpecs: [
      "Azure Face Recognition API",
      "Azure Cosmos DB",
      "Azure AI Studio (Foundry)",
      "Logic Apps",
    ],
    demoLink: "https://example.com/demo-reconocimiento",
  },
  {
    id: 2,
    title: "Agente de Citas Dinámicas",
    shortDescription:
      "Tu asistente que lee entre líneas – Agenda reuniones, encuentra respuestas, detecta emociones y sabe exactamente cuándo necesitas hablar con un humano.",
    longDescription:
      "El Agente de Citas Dinámicas es un orquestador inteligente que transforma la experiencia de agendar desde una tarea tediosa a una conversación natural y eficiente. No solo coordina calendarios y envía confirmaciones: este agente es capaz de entender el contexto completo de tu solicitud, buscar información relevante en bases de conocimiento corporativas y, crucialmente, leer el tono emocional de cada interacción. Cuando un empleado solicita 'una cita urgente sobre mi nómina, estoy muy frustrado', el agente no solo agenda: busca el historial de nómina, detecta el sentimiento negativo, prepara el contexto para el especialista humano y, si la frustración escala a niveles críticos, deriva inmediatamente a un agente senior o de crisis.",
    technicalSpecs: [
      "Azure OpenAI / Azure AI Studio (Foundry)",
      "Azure Cognitive Search",
      "Azure Cognitive Services - Sentiment Analysis",
      "Logic Apps",
      "Azure Cosmos DB",
    ],
    demoLink: "https://example.com/demo-citas",
  },
  {
    id: 3,
    title: "Agente de Filtrado de Postulantes",
    shortDescription:
      "Reclutamiento que ve más allá del CV – Evaluación integral con vigilancia ética: mide conocimientos, detecta potencial de aprendizaje y garantiza la integridad del proceso.",
    longDescription:
      "El Agente de Filtrado de Postulantes redefine la preselección de talento al combinar múltiples capas de inteligencia artificial especializada en un sistema holístico y justo. Este no es un simple examen automatizado: es un ecosistema de cuatro sub-agentes que trabajan en armonía. El Agente de Evaluación administra pruebas personalizadas mientras el Agente de Visión monitorea discretamente la integridad del proceso, detectando comportamientos sospechosos sin invadir la privacidad. Simultáneamente, el Agente de Nivel de Conocimiento mide competencias técnicas actuales, mientras que el innovador Agente de Nivel de Aprendizaje evalúa la capacidad de adaptación y crecimiento del candidato.",
    technicalSpecs: [
      "Azure AI Studio (Foundry)",
      "Azure OpenAI",
      "Azure AI Vision",
      "Azure Cosmos DB",
      "Logic Apps",
    ],
    demoLink: "https://example.com/demo-postulantes",
  },
];

import { useNavigate } from "react-router-dom";

export const AgentCards = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        padding: "2rem",
        backgroundColor: "#2e0527",
        color: "#fff",
      }}
    >
      {agents.map((agent) => (
        <div
          key={agent.id}
          onClick={() => navigate(`/multiagent/${agent.id}`)}
          style={{
            width: "300px",
            padding: "1.5rem",
            backgroundColor: "#3a0633",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{agent.title}</h3>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.4" }}>{agent.shortDescription}</p>
        </div>
      ))}
    </div>
  );
};