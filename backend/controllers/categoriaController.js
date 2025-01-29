const CategoriaService = require('../services/categoriaService');

class CategoriaController {
  static async crearCategoria(req, res) {
    try {
      const categoria = await CategoriaService.crearCategoria(req.body);
      res.status(201).json(categoria);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerCategorias(req, res) {
    try {
      const categorias = await CategoriaService.obtenerCategorias();
      res.status(200).json(categorias);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerCategoriaPorId(req, res) {
    try {
      const categoria = await CategoriaService.obtenerCategoriaPorId(req.params.id);
      if (categoria) {
        res.status(200).json(categoria);
      } else {
        res.status(404).json({ error: 'Categoría no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async actualizarCategoria(req, res) {
    try {
      const categoria = await CategoriaService.actualizarCategoria(req.params.id, req.body);
      if (categoria) {
        res.status(200).json(categoria);
      } else {
        res.status(404).json({ error: 'Categoría no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async eliminarCategoria(req, res) {
    try {
      const eliminado = await CategoriaService.eliminarCategoria(req.params.id);
      if (eliminado) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Categoría no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = CategoriaController;
