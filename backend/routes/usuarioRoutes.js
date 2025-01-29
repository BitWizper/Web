const express = require('express');
const UsuarioController = require('../controllers/usuarioController');

const router = express.Router();

router.post('/crearusuarios', UsuarioController.crearUsuario);
router.get('/obtenerusuarios', UsuarioController.obtenerUsuarios);
router.get('/usuarios/:id', UsuarioController.obtenerUsuarioPorId);
router.put('/actusuarios/:id', UsuarioController.actualizarUsuario);
router.delete('/elimusuarios/:id', UsuarioController.eliminarUsuario);

//login
router.post('/loginuser', UsuarioController.login);

//actualizar
//router.put('/update-profile', UserController.updateProfile);

module.exports = router;
