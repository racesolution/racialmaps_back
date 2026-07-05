import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_CENTRAL_URL = process.env.VITE_API_CENTRAL_URL;
const OUTPUT_PATH = path.join(process.cwd(), 'datos-mapa.csv');

async function exportarBDCentral() {
  console.log("⏳ Robot iniciando: Conectando directamente con Google Apps Script...");
  
  if (!API_CENTRAL_URL) {
    console.error("❌ Error: No se encontró la variable VITE_API_CENTRAL_URL.");
    process.exit(1);
  }

  try {
    // 1. PULL de datos crudos desde GAS
    const response = await fetch(API_CENTRAL_URL);
    const json = await response.json();

    if (json.status !== "success" || !Array.isArray(json.data)) {
      throw new Error("La estructura del JSON devuelto por GAS no es válida.");
    }

    const listaCiudades = json.data;
    if (listaCiudades.length === 0) {
      console.warn("⚠️ Advertencia: No hay datos para procesar hoy.");
      return;
    }

    // 2. Procesamiento y Limpieza (Comas por Puntos decimales)
    const columnas = Object.keys(listaCiudades[0]);
    const filasCsv = listaCiudades.map(ciudad => {
      return columnas.map(nombreColumna => {
        let valor = ciudad[nombreColumna];
        
        // Limpieza de decimales tipo String ("-31,42" -> -31.42)
        if (typeof valor === 'string' && /^\s*-?\d+,\d+\s*$/.test(valor)) {
          valor = parseFloat(valor.replace(',', '.'));
        }
        
        // Encapsular textos que contengan comas internas
        if (typeof valor === 'string' && valor.includes(',')) {
          return `"${valor}"`;
        }
        return valor;
      }).join(',');
    });

    const contenidoCsv = [columnas.join(','), ...filasCsv].join('\n');

    // 3. Escritura física del archivo CSV en el disco del robot
    fs.writeFileSync(OUTPUT_PATH, contenidoCsv, 'utf8');
    console.log(`✅ ¡Éxito! CSV generado físicamente en: ${OUTPUT_PATH}`);

  } catch (error) {
    console.error("❌ Error crítico en el pipeline de datos:", error.message);
    process.exit(1);
  }
}

exportarBDCentral();