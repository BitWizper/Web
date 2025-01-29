const express = require('express');
const path = require('path');


const app = express();

// Servir archivos estáticos (HTML, CSS, JS) desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para login.html
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','components', 'login.html'));
});

// Ruta para register.html
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','components', 'register.html'));
});

// Puerto en el que correrá el servidor
const PORT = process.env.PORT || 4000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log('Servidor de frontend corriendo en http://localhost:${PORT}');
});