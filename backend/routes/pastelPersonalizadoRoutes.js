// routes/pastelPersonalizadoRoutes.js
const express = require('express');
const PastelPersonalizadoController = require('../controllers/pastelpersonalizadoController');

const router = express.Router();

// Ruta para crear un pastel personalizado
router.post('/crearpastelPersonalizado', PastelPersonalizadoController.crearPastelPersonalizado);

// Ruta para obtener todos los pasteles personalizados
router.get('/obtenerpastelPersonalizado', PastelPersonalizadoController.obtenerPastelesPersonalizados);

// Ruta para obtener un pastel personalizado por ID
router.get('/pastelPersonalizado/:id', PastelPersonalizadoController.obtenerPastelPersonalizadoPorId);

// Ruta para actualizar un pastel personalizado por ID
router.put('/actpastelPersonalizado/:id', PastelPersonalizadoController.actualizarPastelPersonalizado);

// Ruta para eliminar un pastel personalizado por ID
router.delete('/elimpastelPersonalizado/:id', PastelPersonalizadoController.eliminarPastelPersonalizado);

module.exports = router;
