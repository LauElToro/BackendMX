const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos
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
  }
});

// Configuración de middleware
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

  const tableName = `${nombre}${segundoNombre}${apellidoPaterno}`;

  const insertQuery = `
    INSERT INTO usuarios (nombre, segundo_nombre, apellido_paterno, apellido_materno, fecha_nacimiento, email, telefono)
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
