import 'dotenv/config'; 
import express, { response } from 'express';
import { Pool } from 'pg';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

// Configurar middleware
app.use(cors());
app.use(express.json());

// Conexión a la base de datos de Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Ruta de prueba
app.get('/', async (req, res) => {
    res.send('dsadsa')
});

// Ruta para obtener todos los mensajes
app.get('/api/cschat', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cschat ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});
// Ruta para añadir un nuevo mensaje
app.post('/api/cschat', async (req, res) => {
  const { user, message } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cschat (user_name, message) VALUES ($1, $2) RETURNING *',
      [user, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});