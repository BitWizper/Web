const PastelService = require('../services/pastelService');

class PastelController {
  static async crearPastel(req, res) {
    try {
      const pastel = await PastelService.crearPastel(req.body);
      res.status(201).json(pastel);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerPasteles(req, res) {
    try {
      const pasteles = await PastelService.obtenerPasteles();
      res.status(200).json(pasteles);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerPastelPorId(req, res) {
    try {
      const pastel = await PastelService.obtenerPastelPorId(req.params.id);
      if (pastel) {
        res.status(200).json(pastel);
      } else {
        res.status(404).json({ error: 'Pastel no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async actualizarPastel(req, res) {
    try {
      const pastel = await PastelService.actualizarPastel(req.params.id, req.body);
      if (pastel) {
        res.status(200).json(pastel);
      } else {
        res.status(404).json({ error: 'Pastel no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async eliminarPastel(req, res) {
    try {
      const eliminado = await PastelService.eliminarPastel(req.params.id);
      if (eliminado) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Pastel no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerPastelesPorCategoria(req, res) {
    try {
      const { id_categoria } = req.params;
      const pasteles = await PastelService.obtenerPastelesPorCategoria(id_categoria);
      res.status(200).json(pasteles);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = PastelController;
