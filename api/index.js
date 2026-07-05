import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from '../routes/chatRoute.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Ruta raíz de control de salud (Evita el error 500 al entrar desde el navegador)
app.get('/', (req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "Servidor de RacialMaps corriendo de forma impecable en Vercel."
  });
});

// Vinculamos el endpoint oficial del chatbot con el nuevo router
app.use('/api/chat', chatRouter);

export default app;