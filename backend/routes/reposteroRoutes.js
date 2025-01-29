const express = require('express');
const ReposteroController = require('../controllers/reposteroController');

const router = express.Router();

router.post('/creareposteros', ReposteroController.crearRepostero);
router.get('/obtenereposteros', ReposteroController.obtenerReposteros);
router.get('/reposteros/:id', ReposteroController.obtenerReposteroPorId);
router.put('/actreposteros/:id', ReposteroController.actualizarRepostero);
router.delete('/elimreposteros/:id', ReposteroController.eliminarRepostero);

module.exports = router;
