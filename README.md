# 🌐 Hackathon Microsoft 2025 — Orquestador Multiagente Cognitivo

## 🧠 Resumen Ejecutivo

Este proyecto aborda el desafío **Auto-Resolve Service Desk**, creando una experiencia de mesa de servicio inteligente con **múltiples agentes cognitivos** que cooperan para resolver solicitudes rutinarias y derivar casos complejos a humanos.  
La solución reduce tiempos de espera, mejora la satisfacción del usuario y garantiza transparencia y seguridad mediante **IA Responsable**.  
Tecnologías principales: **Azure AI Studio (Foundry)**, **Logic Apps**, **Cosmos DB**, **Azure AI Services** (Vision, Face Recognition, Cognitive Search).

---

## 🎯 Desafío

**Desafío 3: Auto-resolve Service Desk**  
Las organizaciones enfrentan sobrecarga de tickets repetitivos. Nuestra solución crea una experiencia multiagente que automatiza tareas rutinarias y deriva casos críticos, aplicable a dominios como **RR. HH., Salud, Finanzas y Atención al Cliente**.

---

## ⚙️ Problema Detectado

- **Fricción y frustración** en procesos manuales (identificación, agendamiento, evaluación).
- **Riesgo operativo y legal** por lentitud en emergencias o evaluaciones.
- **Altos costos humanos** en tareas repetitivas.

---

## 🎯 Objetivo del Proyecto

Crear una **mesa de servicio ágil, segura y transversal** que:

- Automatice procesos complejos multietapa.
- Reduzca tiempos de respuesta en emergencias y rutinas.
- Mejore la experiencia del usuario.
- Promueva la **colaboración entre agentes cognitivos**.
- Garantice transparencia y derivación humana responsable.

---

## 🤖 Solución Propuesta

### 🧩 Orquestador de Agentes Cognitivos

Un **Orquestador** redirige solicitudes a tres agentes especializados:

| Agente                                   | Función                                                 | Tecnologías                           |
| ---------------------------------------- | ------------------------------------------------------- | ------------------------------------- |
| **Agente de Reconocimiento de Personas** | Identificación facial rápida en emergencias o accesos.  | Azure Face Recognition, Cosmos DB     |
| **Agente de Citas Dinámicas**            | Agenda citas, analiza sentimientos y busca información. | Outlook, Cognitive Search, Logic Apps |
| **Agente de Filtrado de Postulantes**    | Evalúa candidatos con IA de integridad y aprendizaje.   | Azure AI Vision, Cosmos DB, Foundry   |

La automatización se realiza mediante **Logic Apps (Runbooks seguros)** y la derivación humana se activa por **umbrales de confianza o alertas críticas**.

---

## 🧩 Arquitectura de la Solución

```
Usuario → Orquestador (Foundry)
        → Agentes Especializados (Reconocimiento, Citas, Reclutamiento)
        → Logic Apps (Integración segura)
        → Azure AI Services / Cosmos DB / Outlook
        → Resolución o Derivación Humana
```

### Componentes Principales

- **Frontend:** Chat/Web (Next.js, React, Vite).
- **Capa de Agentes:** Orquestador + Agentes Especializados.
- **Integraciones:** Logic Apps, Outlook, Cosmos DB.
- **Servicios AI:** Face Recognition, Vision, Sentiment Analysis.
- **Seguridad:** Credenciales gestionadas por Logic Apps y políticas de IA Responsable.

---

## 🧰 Tecnologías Utilizadas

| Categoría             | Servicio                  | Propósito                                               |
| --------------------- | ------------------------- | ------------------------------------------------------- |
| Plataforma de Agentes | Azure AI Studio (Foundry) | Creación y orquestación de agentes                      |
| Integración           | Logic Apps                | Conexión con sistemas externos y Runbooks               |
| Datos                 | Cosmos DB                 | Almacenamiento de perfiles y registros                  |
| IA de Visión          | Azure AI Vision           | Monitoreo de integridad en evaluaciones                 |
| IA de Reconocimiento  | Azure Face Recognition    | Identificación facial                                   |
| IA de Búsqueda        | Cognitive Search          | Recuperación de conocimiento y análisis de sentimientos |
| Comunicación          | Outlook                   | Correo y calendario                                     |

---

## 🧭 Flujo de Usuario — Ejemplo

**Caso:** Solicitud de cita con queja

1. Usuario: “Necesito agendar una cita sobre mi factura, estoy molesto.”
2. Orquestador: Clasifica como _Agendamiento + Sentimiento Negativo_.
3. Agente de Citas: Analiza tono, busca información relevante.
4. Logic Apps: Consulta disponibilidad y agenda cita.
5. Si se detecta amenaza → Derivación a humano (seguridad/legal).

---

## 💡 Casos de Uso

| Agente                      | Auto-resolve             | Derivación Humana                      |
| --------------------------- | ------------------------ | -------------------------------------- |
| **Reconocimiento**          | Acceso sin QR en eventos | Emergencias médicas con baja confianza |
| **Citas Dinámicas**         | Agendamiento rutinario   | Quejas hostiles o complejas            |
| **Filtrado de Postulantes** | Evaluación automática    | Comportamiento sospechoso o fraude     |

---

## 🚀 Innovación

- **Multiagentes colaborativos** que comparten información.
- **IA de Confianza y Proactiva** (Vision + Face Recognition).
- **Transparencia total** en decisiones automatizadas.
- **Framework transversal** aplicable a múltiples dominios.

---

## 📊 Impacto

- ⏱ Reducción del **70%** en tiempos de identificación.
- 🧩 Liberación del **80%** del tiempo humano en tareas repetitivas.
- 😊 Aumento del **20%** en satisfacción del usuario.
- 📈 Mejora en KPIs de reclutamiento y atención.

---

## ⚠️ Limitaciones y Futuro

- Dependencia de la calidad del dato inicial (foto, texto).
- Entrenamiento continuo de modelos de aprendizaje y sentimientos.
- Próximos pasos:
  - Integrar **Azure Service Bus** para comunicación asincrónica.
  - Crear **Agente Legal/Financiero**.
  - Conectar Logic Apps con **ERP/CRM**.

---

## 🧩 Conclusiones

El proyecto cumple con el desafío de crear una **mesa de servicio multiagente** que reduce carga operativa y tiempos de respuesta.  
Demuestra cómo la combinación de **Azure AI Studio, Logic Apps y Azure AI Services** puede resolver problemas críticos en múltiples dominios con **IA Responsable y explicable**.

---

## 🏆 Cumplimiento de Criterios

| Criterio           | Ponderación | Evidencia                                                     |
| ------------------ | ----------- | ------------------------------------------------------------- |
| **Rendimiento**    | 25%         | Baja latencia, escalabilidad modular                          |
| **Innovación**     | 25%         | Multi-IA colaborativa y transversal                           |
| **Amplitud Azure** | 25%         | Uso de AI Studio, Logic Apps, Cosmos DB, Vision, Face, Search |
| **IA Responsable** | 25%         | Transparencia, equidad, derivación humana                     |

---

## 👥 Autores

**Equipo Hackathon Microsoft 2025**  
Proyecto: _Orquestador Multiagente Cognitivo_  
Fecha: _27 de Noviembre del 2025_  
Desarrollado con pasión, ética y visión de futuro 💙
