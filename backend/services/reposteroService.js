const Repostero = require('../models/Repostero');

class ReposteroService {
  static async crearRepostero(data) {
    try {
      const repostero = await Repostero.create(data);
      return repostero;
    } catch (error) {
      throw new Error('Error al crear repostero: ' + error.message);
    }
  }

  static async obtenerReposteros() {
    try {
      const reposteros = await Repostero.findAll();
      return reposteros;
    } catch (error) {
      throw new Error('Error al obtener reposteros: ' + error.message);
    }
  }

  static async obtenerReposteroPorId(id) {
    try {
      const repostero = await Repostero.findByPk(id);
      return repostero;
    } catch (error) {
      throw new Error('Error al obtener repostero: ' + error.message);
    }
  }

  static async actualizarRepostero(id, data) {
    try {
      const repostero = await Repostero.findByPk(id);
      if (!repostero) return null;
      await repostero.update(data);
      return repostero;
    } catch (error) {
      throw new Error('Error al actualizar repostero: ' + error.message);
    }
  }

  static async eliminarRepostero(id) {
    try {
      const repostero = await Repostero.findByPk(id);
      if (!repostero) return null;
      await repostero.destroy();
      return true;
    } catch (error) {
      throw new Error('Error al eliminar repostero: ' + error.message);
    }
  }
}

module.exports = ReposteroService;
