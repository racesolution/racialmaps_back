import { procesarConsultaChat } from '../controllers/consultaController.js';

export const consultaRoute = async (req, res) => {
  const { method } = req;

  // Filtrado de métodos HTTP permitidos
  if (method === 'POST' || method === 'OPTIONS') {
    return await procesarConsultaChat(req, res);
  }

  // Rechazo para métodos no configurados (GET, PUT, DELETE, etc.)
  res.setHeader('Content-Type', 'application/json');
  return res.status(405).json({ message: `El método ${method} no está permitido en este endpoint.` });
};