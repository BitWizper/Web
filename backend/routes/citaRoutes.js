const express = require('express');
const CitaController = require('../controllers/citaController');

const router = express.Router();

router.post('/crearcitas', CitaController.crearCita);
router.get('/obtenercitas', CitaController.obtenerCitas);
router.get('/citas/:id', CitaController.obtenerCitaPorId);
router.put('/actcitas/:id', CitaController.actualizarCita);
router.delete('/elimcitas/:id', CitaController.eliminarCita);

module.exports = router;
