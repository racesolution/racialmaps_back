import { GoogleGenAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Inicializamos el cliente de IA con la API Key de tu entorno
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const consultarIAAntropologica = async (preguntaUsuario) => {
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

  // Ejecutamos la consulta usando el modelo estándar optimizado para texto (gemini-2.5-flash)
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: preguntaUsuario,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.3 // Mantenemos la temperatura baja para respuestas lógicas y científicas
    }
  });

  return response.text;
};