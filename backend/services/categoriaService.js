const Categoria = require('../models/Categoria');

class CategoriaService {
  static async crearCategoria(data) {
    try {
      const categoria = await Categoria.create(data);
      return categoria;
    } catch (error) {
      throw new Error('Error al crear categoría: ' + error.message);
    }
  }

  static async obtenerCategorias() {
    try {
      const categorias = await Categoria.findAll();
      return categorias;
    } catch (error) {
      throw new Error('Error al obtener categorías: ' + error.message);
    }
  }

  static async obtenerCategoriaPorId(id) {
    try {
      const categoria = await Categoria.findByPk(id);
      return categoria;
    } catch (error) {
      throw new Error('Error al obtener categoría: ' + error.message);
    }
  }

  static async actualizarCategoria(id, data) {
    try {
      const categoria = await Categoria.findByPk(id);
      if (!categoria) return null;
      await categoria.update(data);
      return categoria;
    } catch (error) {
      throw new Error('Error al actualizar categoría: ' + error.message);
    }
  }

  static async eliminarCategoria(id) {
    try {
      const categoria = await Categoria.findByPk(id);
      if (!categoria) return null;
      await categoria.destroy();
      return true;
    } catch (error) {
      throw new Error('Error al eliminar categoría: ' + error.message);
    }
  }
}

module.exports = CategoriaService;
