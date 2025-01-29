const Cita = require('../models/Cita');

class CitaService {
  static async crearCita(data) {
    try {
      const cita = await Cita.create(data);
      return cita;
    } catch (error) {
      throw new Error('Error al crear cita: ' + error.message);
    }
  }

  static async obtenerCitas() {
    try {
      const citas = await Cita.findAll();
      return citas;
    } catch (error) {
      throw new Error('Error al obtener citas: ' + error.message);
    }
  }

  static async obtenerCitaPorId(id) {
    try {
      const cita = await Cita.findByPk(id);
      return cita;
    } catch (error) {
      throw new Error('Error al obtener cita: ' + error.message);
    }
  }

  static async actualizarCita(id, data) {
    try {
      const cita = await Cita.findByPk(id);
      if (!cita) return null;
      await cita.update(data);
      return cita;
    } catch (error) {
      throw new Error('Error al actualizar cita: ' + error.message);
    }
  }

  static async eliminarCita(id) {
    try {
      const cita = await Cita.findByPk(id);
      if (!cita) return null;
      await cita.destroy();
      return true;
    } catch (error) {
      throw new Error('Error al eliminar cita: ' + error.message);
    }
  }
}

module.exports = CitaService;
