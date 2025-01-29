// controllers/pastelPersonalizadoController.js
const PastelPersonalizadoService = require('../services/pastelpersonalizadoService');

class PastelPersonalizadoController {
  static async crearPastelPersonalizado(req, res) {
    try {
      const pastelPersonalizado = await PastelPersonalizadoService.crearPastelPersonalizado(req.body);
      res.status(201).json(pastelPersonalizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerPastelesPersonalizados(req, res) {
    try {
      const pasteles = await PastelPersonalizadoService.obtenerPastelesPersonalizados();
      res.status(200).json(pasteles);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerPastelPersonalizadoPorId(req, res) {
    try {
      const pastelPersonalizado = await PastelPersonalizadoService.obtenerPastelPersonalizadoPorId(req.params.id);
      if (pastelPersonalizado) {
        res.status(200).json(pastelPersonalizado);
      } else {
        res.status(404).json({ error: 'Pastel personalizado no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async actualizarPastelPersonalizado(req, res) {
    try {
      const pastelPersonalizado = await PastelPersonalizadoService.actualizarPastelPersonalizado(req.params.id, req.body);
      if (pastelPersonalizado) {
        res.status(200).json(pastelPersonalizado);
      } else {
        res.status(404).json({ error: 'Pastel personalizado no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async eliminarPastelPersonalizado(req, res) {
    try {
      const eliminado = await PastelPersonalizadoService.eliminarPastelPersonalizado(req.params.id);
      if (eliminado) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Pastel personalizado no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = PastelPersonalizadoController;
