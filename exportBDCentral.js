import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// 1. Cargamos la URL desde tu archivo .env local
dotenv.config();

const API_CENTRAL_URL = process.env.VITE_API_CENTRAL_URL;

// 2. Ruta de salida apuntando dinámicamente al directorio público de tu frontend
const OUTPUT_PATH = path.join(process.cwd(), '..', 'racialmaps_front', 'public', 'datos-mapa.csv');

export async function exportBDCentral() {
  if (!API_CENTRAL_URL) {
    console.error("❌ Error: No se encontró la variable VITE_API_CENTRAL_URL en el archivo .env de racialmaps_back");
    process.exit(1);
  }

  console.log("⏳ Conectando con la API Central de datos...");
  
  try {
    const response = await fetch(API_CENTRAL_URL);
    const json = await response.json();

    if (json.status !== "success" || !Array.isArray(json.data)) {
      throw new Error("La estructura del JSON devuelto no contiene la matriz de datos esperada.");
    }

    const listaCiudades = json.data;

    if (listaCiudades.length === 0) {
      console.warn("⚠️ Advertencia: El endpoint devolvió una lista vacía.");
      return;
    }

    // 3. Extraer cabeceras (columnas) en base a las llaves del JSON
    const columnas = Object.keys(listaCiudades[0]);
    
    // 4. Mapear las filas transformándolas a formato CSV plano
    const filasCsv = listaCiudades.map(ciudad => {
      return columnas.map(nombreColumna => {
        let valor = ciudad[nombreColumna];
        if (typeof valor === 'string' && valor.includes(',')) {
          return `"${valor}"`; // Encapsula textos que contengan comas internas
        }
        return valor;
      }).join(',');
    });

    const contenidoCsv = [columnas.join(','), ...filasCsv].join('\n');

    // 5. Validar si la carpeta del frontend existe en el entorno local
    const carpetaDestino = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(carpetaDestino)) {
      throw new Error(`No se encontró la carpeta de destino en: ${carpetaDestino}. Asegúrate de que tus carpetas front y back estén al mismo nivel y el nombre sea correcto.`);
    }

    // 6. Escribir el archivo final .csv directo en el frontend
    fs.writeFileSync(OUTPUT_PATH, contenidoCsv, 'utf8');
    
    console.log(`✅ ¡Éxito! Base de datos centralizada e inyectada correctamente en tu frontend: \n📍 ${OUTPUT_PATH}`);

  } catch (error) {
    console.error("❌ Error durante el proceso de exportación:", error.message);
  }
}

// Auto-ejecución nativa cuando corres el archivo directamente por terminal
exportBDCentral();