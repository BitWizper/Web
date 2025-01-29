// controllers/pedidoController.js
const PedidoService = require('../services/pedidoService');

class PedidoController {
  static async crearPedido(req, res) {
    console.log('Datos recibidos para crear pedido:', req.body); // Verificar datos recibidos
    try {
      const pedido = await PedidoService.crearPedido(req.body);
      res.status(201).json(pedido);
    } catch (error) {
      console.error('Error al crear pedido:', error); // Log del error
      res.status(400).json({ error: error.message });
    }
  }
  

  static async obtenerPedidos(req, res) {
    try {
      const pedidos = await PedidoService.obtenerPedidos();
      res.status(200).json(pedidos);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerPedidoPorId(req, res) {
    try {
      const pedido = await PedidoService.obtenerPedidoPorId(req.params.id);
      if (pedido) {
        res.status(200).json(pedido);
      } else {
        res.status(404).json({ error: 'Pedido no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async actualizarPedido(req, res) {
    try {
      const pedido = await PedidoService.actualizarPedido(req.params.id, req.body);
      if (pedido) {
        res.status(200).json(pedido);
      } else {
        res.status(404).json({ error: 'Pedido no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async eliminarPedido(req, res) {
    try {
      const eliminado = await PedidoService.eliminarPedido(req.params.id);
      if (eliminado) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Pedido no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = PedidoController;
