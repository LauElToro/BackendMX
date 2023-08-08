const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

const dbConfig = {
  host: 'data-avimo.cgriqmyweq5c.us-east-2.rds.amazonaws.com',
  user: 'testing',
  password: 'Pruebas%ALI%2020',
  database: 'testing_ali_fullstack',
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');

    // Crear la tabla si no existe
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS LautaroFigueroa (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255),
        segundo_nombre VARCHAR(255),
        apellido_paterno VARCHAR(255),
        apellido_materno VARCHAR(255),
        fecha_nacimiento VARCHAR(255),
        email VARCHAR(255),
        telefono VARCHAR(255)
      )
    `;

    connection.query(createTableQuery, (createErr, createResult) => {
      if (createErr) {
        console.error('Error al crear la tabla usuarios:', createErr);
      } else {
        console.log('Tabla usuarios creada o ya existente');
      }
    });
  }
});

app.use(cors());
app.use(bodyParser.json());

// Ruta para guardar datos en la tabla "usuarios"
app.post('/api/usuarios', (req, res) => {
  const {
    nombre,
    segundoNombre,
    apellidoPaterno,
    apellidoMaterno,
    fechaNacimiento,
    email,
    telefono,
  } = req.body;

  const tableName = `${nombre}${segundoNombre || ''}${apellidoPaterno}${apellidoMaterno || ''}`;

  const insertQuery = `
    INSERT INTO LautaroFigueroa (nombre, segundo_nombre, apellido_paterno, apellido_materno, fecha_nacimiento, email, telefono)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nombre,
    segundoNombre,
    apellidoPaterno,
    apellidoMaterno,
    fechaNacimiento,
    email,
    telefono,
  ];

  connection.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error('Error al guardar datos en la tabla usuarios:', err);
      res.status(500).json({ error: 'Error al guardar datos' });
    } else {
      console.log('Datos guardados exitosamente');
      res.status(201).json({ message: 'Datos guardados exitosamente' });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor API corriendo en el puerto ${port}`);
});
