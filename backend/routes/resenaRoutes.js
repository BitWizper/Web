const express = require('express');
const ResenaController = require('../controllers/resenaController');

const router = express.Router();

router.post('/crearresenas', ResenaController.crearResena);
router.get('/obtenerresenas', ResenaController.obtenerResenas);
router.get('/resenas/:id', ResenaController.obtenerResenaPorId);
router.put('/actresenas/:id', ResenaController.actualizarResena);
router.delete('/elimresenas/:id', ResenaController.eliminarResena);

module.exports = router;
