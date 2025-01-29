const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const bcryptjs =require ('bcryptjs');



// Importar rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const pastelRoutes = require('./routes/pastelRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const reposteroRoutes = require ('./routes/reposteroRoutes');
const citaRoutes=require ('./routes/citaRoutes');
const pastelPersonalizadoRoutes = require ('./routes/pastelPersonalizadoRoutes');
const resenaRoutes = require ('./routes/resenaRoutes');
const pedidoRoutes = require ('./routes/pedidoRoutes');

const app = express();
const port = process.env.PORT || 3000; 

// Middleware
// Configura CORS para permitir solicitudes desde el frontend
app.use(cors({
  origin: 'http://localhost:4000', // Cambia este valor al puerto de tu frontend
  credentials: true // Permite enviar cookies si es necesario
}));

app.use(express.json());

// Rutas
app.use('/api/usuario', usuarioRoutes);
app.use('/api/pastel', pastelRoutes);
app.use('/api/categoria', categoriaRoutes);
app.use('/api/repostero', reposteroRoutes);
app.use('/api/cita', citaRoutes);
app.use ('/api/PastelPersonalizado', pastelPersonalizadoRoutes);
app.use ('/api/resena', resenaRoutes);
app.use ('/api/pedido', pedidoRoutes);



// Sincronizar la base de datos
sequelize.sync().then(() => {
  console.log('Base de datos sincronizada');
  app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
}).catch(error => {
  console.error('Error al sincronizar la base de datos:', error);
});
