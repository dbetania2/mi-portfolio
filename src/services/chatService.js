export const sendMessageToBot = async (userMessage) => {
  const API_URL = process.env.NEXT_PUBLIC_BOT_API_URL;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    const result = await response.json();
    
    // Tu server.js devuelve { success: true, data: "..." }
    if (result.success) {
      return result.data; 
    } else {
      throw new Error(result.error || "Error en la lógica del bot");
    }

  } catch (error) {
    console.error("Error al conectar con el chatbot:", error);
    return "Lo siento, mi conexión está fallando. ¿Podés intentar más tarde?";
  }
};