const express = require('express');
const UsuarioController = require('../controllers/usuarioController');
const { verificarToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');

// Configuración de multer para subida de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads/profiles'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png)'));
    }
});

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

// Nuevas rutas para configuración
router.put('/cambiar-password', verificarToken, UsuarioController.cambiarPassword);
router.put('/actualizar-preferencias', verificarToken, UsuarioController.actualizarPreferencias);
router.get('/preferencias', verificarToken, UsuarioController.obtenerPreferencias);

// Rutas de perfil (protegidas)
router.get('/perfil', authMiddleware, UsuarioController.obtenerPerfil);
router.put('/actualizar-perfil', authMiddleware, UsuarioController.actualizarPerfil);
router.post('/actualizar-imagen', authMiddleware, upload.single('imagen'), UsuarioController.actualizarImagenPerfil);

module.exports = router;
