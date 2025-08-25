import 'dotenv/config';

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const jsonPath = path.resolve('./db.json');

async function seedDatabase() {
  console.log('Iniciando el proceso de configuracion...');
  try {
    // Paso 1: Crear la tabla si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cschat (
        id SERIAL PRIMARY KEY,
        user_name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL
      );
    `);
    console.log('Tabla "cschat" creada o ya existente.');

    // Paso 2: Leer el archivo JSON con los datos
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(jsonData);
    const messages = data.csblog;

    // Paso 3: Insertar los datos en la tabla
    for (const msg of messages) {
      await pool.query(
        'INSERT INTO cschat (user_name, message) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [msg.user, msg.content]
      );
    }
    console.log('¡Datos iniciales insertados correctamente!');
  } catch (error) {
    console.error('Error durante el proceso de inicialización:', error);
  } finally {
    pool.end();
  }
}

seedDatabase();