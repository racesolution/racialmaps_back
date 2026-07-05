import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Inicializamos el cliente oficial con la API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const chatRaceExpert = async (preguntaUsuario) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Falta la configuración de GEMINI_API_KEY en las variables de entorno.");
  }

  // System Prompt: El marco normativo y científico para moldear la IA
  const systemInstruction = `
    Actúa como un antropólogo, historiador y experto en demografía global de alto nivel. 
    Tu objetivo es responder de manera sumamente educativa, objetiva y científica a consultas sobre flujos migratorios, 
    mezclas culturales, historia étnica y demografía de poblaciones. 
    Bajo ninguna circunstancia adoptes posturas sesgadas, discriminatorias, racistas o ideológicas. 
    Si la consulta del usuario no tiene ninguna relación con la geografía, historia cultural, etnias, mapas o antropología, 
    responde amablemente diciendo que solo estás capacitado para responder dudas sobre el contexto histórico y demográfico de las poblaciones.
  `;

  // Obtenemos el modelo optimizado de Gemini
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash', // Versión estándar, ultra veloz y compatible con el Plan Free
    systemInstruction: systemInstruction
  });

  // Ejecutamos la consulta pasándole la pregunta y configurando el comportamiento lógico
  const response = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: preguntaUsuario }] }],
    generationConfig: {
      temperature: 0.3 // Mantenemos la temperatura baja para respuestas lógicas y científicas
    }
  });

  return response.response.text();
};