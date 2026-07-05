import { chatRaceExpert } from '../models/chatModel.js';

export const procesarMensajeChat = async (req, res) => {
  const { mensaje } = req.body;

  if (!mensaje) {
    return res.status(400).json({ 
      error: "El parámetro 'mensaje' es requerido en el cuerpo de la petición." 
    });
  }

  try {
    // Invocamos la función con su nuevo nombre
    const respuestaIA = await chatRaceExpert(mensaje);

    return res.status(200).json({
      status: "success",
      respuesta: respuestaIA
    });

  } catch (error) {
    console.error("❌ Error en el controlador de chat:", error.message);
    return res.status(500).json({
      error: "Hubo un problema al procesar tu solicitud con el motor de IA."
    });
  }
};