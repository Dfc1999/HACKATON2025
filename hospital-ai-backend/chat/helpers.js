function validateRequestBody(req) {
  try {
    const body = req.body;
    if (!body) {
      throw new Error("El cuerpo de la solicitud está vacío.");
    }

    const { userId, userName, message } = body;

    return {
      userId: userId || "user-demo-001",
      userName: userName || "Usuario de pruebas",
      message
    };
  } catch (error) {
    throw new Error(`Error de validación: ${error.message}`);
  }
}

function handleError(error) {
  console.error("Error en la función /chat:", error);
  return {
    status: "error",
    message: error.message || "Error interno del servidor"
  };
}

module.exports = { validateRequestBody, handleError };
