interface BotApiResponse {
  success: boolean
  data?: string
  error?: string
}

export const sendMessageToBot = async (userMessage: string): Promise<string> => {
  const API_URL = process.env.NEXT_PUBLIC_BOT_API_URL

  if (!API_URL) {
    return 'El servicio de chatbot no está configurado temporalmente. Podés contactarme directamente mediante la sección de Contacto.'
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    })

    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor (${response.status})`)
    }

    const result = (await response.json()) as BotApiResponse

    if (result.success && result.data) {
      return result.data
    } else {
      throw new Error(result.error || 'Error en la lógica del bot')
    }
  } catch (error) {
    console.error('Error al conectar con el chatbot:', error)
    return 'Lo siento, mi conexión está fallando. ¿Podés intentar más tarde?'
  }
}

