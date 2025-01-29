// services/pedidoService.js
const Pedido = require('../models/Pedido');

class PedidoService {
  static async crearPedido(data) {
    console.log('Datos en el servicio para crear pedido:', data); // Verificar datos
    try {
      const pedido = await Pedido.create(data);
      return pedido;
    } catch (error) {
      console.error('Error al crear pedido en el servicio:', error); // Log del error
      throw new Error('Error al crear pedido: ' + error.message);
    }
  }
  

  static async obtenerPedidos() {
    try {
      const pedidos = await Pedido.findAll();
      return pedidos;
    } catch (error) {
      throw new Error('Error al obtener pedidos: ' + error.message);
    }
  }

  static async obtenerPedidoPorId(id) {
    try {
      const pedido = await Pedido.findByPk(id);
      return pedido;
    } catch (error) {
      throw new Error('Error al obtener pedido: ' + error.message);
    }
  }

  static async actualizarPedido(id, data) {
    try {
      const pedido = await Pedido.findByPk(id);
      if (!pedido) return null;
      await pedido.update(data);
      return pedido;
    } catch (error) {
      throw new Error('Error al actualizar pedido: ' + error.message);
    }
  }

  static async eliminarPedido(id) {
    try {
      const pedido = await Pedido.findByPk(id);
      if (!pedido) return null;
      await pedido.destroy();
      return true;
    } catch (error) {
      throw new Error('Error al eliminar pedido: ' + error.message);
    }
  }
}

module.exports = PedidoService;
