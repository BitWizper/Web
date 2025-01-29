const ResenaService = require('../services/resenaService');

class ResenaController {
  static async crearResena(req, res) {
    try {
      const resena = await ResenaService.crearResena(req.body);
      res.status(201).json(resena);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerResenas(req, res) {
    try {
      const resenas = await ResenaService.obtenerResenas();
      res.status(200).json(resenas);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerResenaPorId(req, res) {
    try {
      const resena = await ResenaService.obtenerResenaPorId(req.params.id);
      if (resena) {
        res.status(200).json(resena);
      } else {
        res.status(404).json({ error: 'Reseña no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async actualizarResena(req, res) {
    try {
      const resena = await ResenaService.actualizarResena(req.params.id, req.body);
      if (resena) {
        res.status(200).json(resena);
      } else {
        res.status(404).json({ error: 'Reseña no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async eliminarResena(req, res) {
    try {
      const eliminado = await ResenaService.eliminarResena(req.params.id);
      if (eliminado) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Reseña no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ResenaController;
