const Resena = require('../models/Resena');

class ResenaService {
  static async crearResena(data) {
    try {
      const resena = await Resena.create(data);
      return resena;
    } catch (error) {
      throw new Error('Error al crear reseña: ' + error.message);
    }
  }

  static async obtenerResenas() {
    try {
      const resenas = await Resena.findAll();
      return resenas;
    } catch (error) {
      throw new Error('Error al obtener reseñas: ' + error.message);
    }
  }

  static async obtenerResenaPorId(id) {
    try {
      const resena = await Resena.findByPk(id);
      return resena;
    } catch (error) {
      throw new Error('Error al obtener reseña: ' + error.message);
    }
  }

  static async actualizarResena(id, data) {
    try {
      const resena = await Resena.findByPk(id);
      if (!resena) return null;
      await resena.update(data);
      return resena;
    } catch (error) {
      throw new Error('Error al actualizar reseña: ' + error.message);
    }
  }

  static async eliminarResena(id) {
    try {
      const resena = await Resena.findByPk(id);
      if (!resena) return null;
      await resena.destroy();
      return true;
    } catch (error) {
      throw new Error('Error al eliminar reseña: ' + error.message);
    }
  }
}

module.exports = ResenaService;
