const { createAIClient, processMessage } = require("./aiClient");
const { validateRequestBody, handleError } = require("./helpers");

module.exports = async function (context, req) {
  context.log("Solicitud recibida en /chat");

  // Headers CORS - aplicar a todas las respuestas
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // O específicamente: "http://localhost:5175"
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
    "Access-Control-Max-Age": "86400"
  };

  // Manejar preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    context.res = {
      status: 200,
      headers: corsHeaders,
      body: ""
    };
    return;
  }

  try {
    const { userId, userName, message } = validateRequestBody(req);
    const { client, agentId } = await createAIClient();

    const result = await processMessage(client, agentId, userId, userName, message);

    context.res = {
      status: 200,
      headers: corsHeaders,
      body: {
        status: "success",
        response: result.response,
        threadId: result.threadId,
        runId: result.runId,
        rawMessages: result.rawMessages
      }
    };
  } catch (error) {
    const errResponse = handleError(error);
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: errResponse
    };
  }
};