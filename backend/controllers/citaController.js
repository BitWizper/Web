const CitaService = require('../services/citaService');

class CitaController {
  static async crearCita(req, res) {
    try {
      const cita = await CitaService.crearCita(req.body);
      res.status(201).json(cita);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerCitas(req, res) {
    try {
      const citas = await CitaService.obtenerCitas();
      res.status(200).json(citas);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerCitaPorId(req, res) {
    try {
      const cita = await CitaService.obtenerCitaPorId(req.params.id);
      if (cita) {
        res.status(200).json(cita);
      } else {
        res.status(404).json({ error: 'Cita no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async actualizarCita(req, res) {
    try {
      const cita = await CitaService.actualizarCita(req.params.id, req.body);
      if (cita) {
        res.status(200).json(cita);
      } else {
        res.status(404).json({ error: 'Cita no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async eliminarCita(req, res) {
    try {
      const eliminado = await CitaService.eliminarCita(req.params.id);
      if (eliminado) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Cita no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = CitaController;
