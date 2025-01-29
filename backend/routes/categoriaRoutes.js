const express = require('express');
const CategoriaController = require('../controllers/categoriaController');

const router = express.Router();

router.post('/crearcategorias', CategoriaController.crearCategoria);
router.get('/obtenercategorias', CategoriaController.obtenerCategorias);
router.get('/categorias/:id', CategoriaController.obtenerCategoriaPorId);
router.put('/actcategorias/:id', CategoriaController.actualizarCategoria);
router.delete('/elimcategorias/:id', CategoriaController.eliminarCategoria);



module.exports = router;
