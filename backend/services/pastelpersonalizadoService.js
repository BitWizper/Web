// services/pastelPersonalizadoService.js
const PastelPersonalizado = require('../models/PastelPersonalizado');

class PastelPersonalizadoService {
  static async crearPastelPersonalizado(data) {
    try {
      const pastelPersonalizado = await PastelPersonalizado.create(data);
      return pastelPersonalizado;
    } catch (error) {
      throw new Error('Error al crear pastel personalizado: ' + error.message);
    }
  }

  static async obtenerPastelesPersonalizados() {
    try {
      const pasteles = await PastelPersonalizado.findAll();
      return pasteles;
    } catch (error) {
      throw new Error('Error al obtener pasteles personalizados: ' + error.message);
    }
  }

  static async obtenerPastelPersonalizadoPorId(id) {
    try {
      const pastelPersonalizado = await PastelPersonalizado.findByPk(id);
      return pastelPersonalizado;
    } catch (error) {
      throw new Error('Error al obtener pastel personalizado: ' + error.message);
    }
  }

  static async actualizarPastelPersonalizado(id, data) {
    try {
      const pastelPersonalizado = await PastelPersonalizado.findByPk(id);
      if (!pastelPersonalizado) return null;
      await pastelPersonalizado.update(data);
      return pastelPersonalizado;
    } catch (error) {
      throw new Error('Error al actualizar pastel personalizado: ' + error.message);
    }
  }

  static async eliminarPastelPersonalizado(id) {
    try {
      const pastelPersonalizado = await PastelPersonalizado.findByPk(id);
      if (!pastelPersonalizado) return null;
      await pastelPersonalizado.destroy();
      return true;
    } catch (error) {
      throw new Error('Error al eliminar pastel personalizado: ' + error.message);
    }
  }
}

module.exports = PastelPersonalizadoService;
