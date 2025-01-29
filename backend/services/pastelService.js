const Pastel = require('../models/Pastel'); // Asegúrate de importar el modelo

class PastelService {
  static async crearPastel(data) {
    try {
      const pastel = await Pastel.create(data);
      return pastel;
    } catch (error) {
      throw new Error('Error al crear pastel: ' + error.message);
    }
  }

  static async obtenerPasteles() {
    try {
      const pasteles = await Pastel.findAll();
      return pasteles;
    } catch (error) {
      throw new Error('Error al obtener pasteles: ' + error.message);
    }
  }

  static async obtenerPastelPorId(id) {
    try {
      const pastel = await Pastel.findByPk(id);
      return pastel;
    } catch (error) {
      throw new Error('Error al obtener pastel: ' + error.message);
    }
  }

  static async actualizarPastel(id, data) {
    try {
      const pastel = await Pastel.findByPk(id);
      if (!pastel) return null;
      await pastel.update(data);
      return pastel;
    } catch (error) {
      throw new Error('Error al actualizar pastel: ' + error.message);
    }
  }

  static async eliminarPastel(id) {
    try {
      const pastel = await Pastel.findByPk(id);
      if (!pastel) return null;
      await pastel.destroy();
      return true;
    } catch (error) {
      throw new Error('Error al eliminar pastel: ' + error.message);
    }
  }

  // Nuevo método para obtener pasteles por categoría
  static async obtenerPastelesPorCategoria(id_categoria) {
    try {
      const pasteles = await Pastel.findAll({ where: { id_categoria } });
      return pasteles;
    } catch (error) {
      throw new Error('Error al obtener pasteles por categoría: ' + error.message);
    }
  }
}

module.exports = PastelService;
