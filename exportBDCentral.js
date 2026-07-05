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

    // 2. Mapeo directo y ordenado de columnas tal cual tu GSheets
    const columnas = ["Ciudad", "Latitud", "Longitud", "RazaBlanca", "RazaNegra", "RazaRoja", "RazaAmarilla", "Poblacion"];
    const cabecera = columnas.join(",");

    const filasCsv = listaCiudades.map(ciudad => {
      return columnas.map(col => {
        let valor = ciudad[col];
        
        // Control por si falta algún dato
        if (valor === undefined || valor === null) return "";
        
        // Si es un texto y tiene comas internas, lo envolvemos en comillas
        if (typeof valor === 'string' && valor.includes(',')) {
          return `"${valor}"`;
        }
        
        // Los números y textos limpios pasan directo sin alterarse
        return valor;
      }).join(',');
    });

    const contenidoCsv = [cabecera, ...filasCsv].join('\n');

    // 3. Escritura física del archivo CSV en el disco del robot
    fs.writeFileSync(OUTPUT_PATH, contenidoCsv, 'utf8');
    console.log(`✅ ¡Éxito! CSV generado físicamente en: ${OUTPUT_PATH}`);

  } catch (error) {
    console.error("❌ Error crítico en el pipeline de datos:", error.message);
    process.exit(1);
  }
}

exportarBDCentral();