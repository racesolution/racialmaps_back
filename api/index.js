import { consultaRoute } from '../routes/consultaRoute.js';

export default async function handler(req, res) {
  return await consultaRoute(req, res);
}