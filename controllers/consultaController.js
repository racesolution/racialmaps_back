import { consultarIAAntropologica } from '../models/consultaModel.js';

export const procesarConsultaChat = async (req, res) => {
  // Configuración obligatoria de CORS para permitir peticiones desde tu Frontend en Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Si el navegador web envía una petición de pre-verificación (OPTIONS), respondemos OK
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { pregunta } = req.body;

    // Validación de entrada
    if (!pregunta || pregunta.trim() === "") {
      return res.status(400).json({ error: "El campo 'pregunta' es obligatorio." });
    }

    // Consumimos el modelo
    const respuestaIA = await consultarIAAntropologica(pregunta.trim());

    // Retornamos la respuesta exitosa en formato JSON estructurado
    return res.status(200).json({ respuesta: respuestaIA });

  } catch (error) {
    console.error("Error capturado en consultaController:", error.message);
    return res.status(500).json({ error: "Hubo un problema interno al procesar la consulta antropológica." });
  }
};