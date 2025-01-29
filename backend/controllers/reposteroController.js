const ReposteroService = require('../services/reposteroService');

class ReposteroController {
  static async crearRepostero(req, res) {
    try {
      const repostero = await ReposteroService.crearRepostero(req.body);
      res.status(201).json(repostero);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerReposteros(req, res) {
    try {
      const reposteros = await ReposteroService.obtenerReposteros();
      res.status(200).json(reposteros);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerReposteroPorId(req, res) {
    try {
      const repostero = await ReposteroService.obtenerReposteroPorId(req.params.id);
      if (repostero) {
        res.status(200).json(repostero);
      } else {
        res.status(404).json({ error: 'Repostero no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async actualizarRepostero(req, res) {
    try {
      const repostero = await ReposteroService.actualizarRepostero(req.params.id, req.body);
      if (repostero) {
        res.status(200).json(repostero);
      } else {
        res.status(404).json({ error: 'Repostero no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async eliminarRepostero(req, res) {
    try {
      const eliminado = await ReposteroService.eliminarRepostero(req.params.id);
      if (eliminado) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Repostero no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ReposteroController;
