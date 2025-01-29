// routes/pedidoRoutes.js
const express = require('express');
const PedidoController = require('../controllers/pedidoController');

const router = express.Router();

// Ruta para crear un pedido
router.post('/crearpedido', PedidoController.crearPedido);

// Ruta para obtener todos los pedidos
router.get('/obtenerpedidos', PedidoController.obtenerPedidos);

// Ruta para obtener un pedido por ID
router.get('/pedido/:id', PedidoController.obtenerPedidoPorId);

// Ruta para actualizar un pedido por ID
router.put('/actpedido/:id', PedidoController.actualizarPedido);

// Ruta para eliminar un pedido por ID
router.delete('/elimpedido/:id', PedidoController.eliminarPedido);

module.exports = router;
