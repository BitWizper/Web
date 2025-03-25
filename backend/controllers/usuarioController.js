const UsuarioService = require('../services/usuarioService');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'tu_clave_secreta'; // Usa una clave segura y mantenla en secreto
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const db = require('../config/database');
const path = require('path');
const fs = require('fs').promises;

class UsuarioController {
  static async crearUsuario(req, res) {
    try {
      const usuario = await UsuarioService.crearUsuario(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerUsuarios(req, res) {
    try {
      const usuarios = await UsuarioService.obtenerUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerUsuarioPorId(req, res) {
    try {
      const usuario = await UsuarioService.obtenerUsuarioPorId(req.params.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async actualizarUsuario(req, res) {
    try {
      const usuario = await UsuarioService.actualizarUsuario(req.params.id, req.body);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async eliminarUsuario(req, res) {
    try {
      const eliminado = await UsuarioService.eliminarUsuario(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Nuevo método para manejar el inicio de sesión
  static async login(req, res) {
    const { correo, contrasena } = req.body;

    console.log("Datos recibidos en el login:", { correo, contrasena }); // Log para verificar entrada

    // Validación: asegurarse de que correo y contrasena están presentes
    if (!correo || !contrasena) {
        return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    try {
        // Autenticar usuario
        const usuario = await UsuarioService.autenticarUsuario(correo, contrasena);
        console.log("Resultado de autenticarUsuario:", usuario); // Log para verificar si encontró al usuario

        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Generar el token JWT con expiración de 24 horas
        const token = jwt.sign(
            { id: usuario.id, correo: usuario.correo }, // Payload
            SECRET_KEY, // Clave secreta
            { expiresIn: '24h' } // Expiración de 24 horas
        );

        console.log("Token generado:", token); // Log para verificar que el token se creó correctamente

        // Enviar el usuario y el token como respuesta
        return res.status(200).json({ usuario, token });
    } catch (error) {
        console.error("Error en login:", error.message); // Log de error
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Nuevo método para actualizar el perfil del usuario
  static async actualizarPerfil(req, res) {
    try {
      const userId = req.user.id;
      const { nombre, correo, telefono, direccion } = req.body;

      // Verificar si el correo ya está en uso por otro usuario
      const [existingUser] = await db.query(
        'SELECT id FROM usuarios WHERE correo = ? AND id != ?',
        [correo, userId]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ mensaje: 'El correo ya está en uso' });
      }

      await db.query(
        'UPDATE usuarios SET nombre = ?, correo = ?, telefono = ?, direccion = ? WHERE id = ?',
        [nombre, correo, telefono, direccion, userId]
      );

      res.json({ mensaje: 'Perfil actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      res.status(500).json({ mensaje: 'Error al actualizar el perfil' });
    }
  }

  static async cambiarPassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.usuario.id; // Viene del token

      // Obtener usuario de la base de datos
      const [usuario] = await db.query('SELECT * FROM usuarios WHERE id = ?', [userId]);
      
      if (!usuario[0]) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }

      // Verificar contraseña actual
      const passwordValida = await bcrypt.compare(currentPassword, usuario[0].contrasena);
      if (!passwordValida) {
        return res.status(400).json({ mensaje: 'Contraseña actual incorrecta' });
      }

      // Encriptar nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Actualizar contraseña
      await db.query('UPDATE usuarios SET contrasena = ? WHERE id = ?', [hashedPassword, userId]);

      res.json({ mensaje: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al actualizar la contraseña' });
    }
  }

  static async actualizarPreferencias(req, res) {
    try {
      const { idioma, notificaciones_email, perfil_publico } = req.body;
      const userId = req.usuario.id;

      // Verificar si ya existen preferencias
      const [preferenciasExistentes] = await db.query(
        'SELECT * FROM preferencias_usuario WHERE usuario_id = ?',
        [userId]
      );

      if (preferenciasExistentes.length > 0) {
        // Actualizar preferencias existentes
        await db.query(
          'UPDATE preferencias_usuario SET idioma = ?, notificaciones_email = ?, perfil_publico = ? WHERE usuario_id = ?',
          [idioma, notificaciones_email, perfil_publico, userId]
        );
      } else {
        // Crear nuevas preferencias
        await db.query(
          'INSERT INTO preferencias_usuario (usuario_id, idioma, notificaciones_email, perfil_publico) VALUES (?, ?, ?, ?)',
          [userId, idioma, notificaciones_email, perfil_publico]
        );
      }

      res.json({ mensaje: 'Preferencias actualizadas exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al actualizar las preferencias' });
    }
  }

  static async obtenerPreferencias(req, res) {
    try {
      const userId = req.usuario.id;

      const [preferencias] = await db.query(
        'SELECT idioma, notificaciones_email, perfil_publico FROM preferencias_usuario WHERE usuario_id = ?',
        [userId]
      );

      if (preferencias.length === 0) {
        // Si no hay preferencias, devolver valores por defecto
        return res.json({
          idioma: 'es',
          notificaciones_email: true,
          perfil_publico: false
        });
      }

      res.json(preferencias[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al obtener las preferencias' });
    }
  }

  static async obtenerPerfil(req, res) {
    try {
      const userId = req.user.id;
      const [usuario] = await db.query(
        'SELECT id, nombre, correo, telefono, direccion, imagen_url FROM usuarios WHERE id = ?',
        [userId]
      );

      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }

      res.json(usuario);
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({ mensaje: 'Error al obtener el perfil' });
    }
  }

  static async actualizarImagenPerfil(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ mensaje: 'No se proporcionó ninguna imagen' });
      }

      const userId = req.user.id;
      const imagenUrl = `/uploads/profiles/${req.file.filename}`;

      // Obtener la imagen anterior
      const [usuario] = await db.query(
        'SELECT imagen_url FROM usuarios WHERE id = ?',
        [userId]
      );

      // Eliminar la imagen anterior si existe
      if (usuario && usuario.imagen_url) {
        const imagenAnterior = path.join(__dirname, '..', 'public', usuario.imagen_url);
        if (fs.existsSync(imagenAnterior)) {
          fs.unlinkSync(imagenAnterior);
        }
      }

      // Actualizar la URL de la imagen en la base de datos
      await db.query(
        'UPDATE usuarios SET imagen_url = ? WHERE id = ?',
        [imagenUrl, userId]
      );

      res.json({ 
        mensaje: 'Imagen de perfil actualizada exitosamente',
        imagen_url: imagenUrl 
      });
    } catch (error) {
      console.error('Error al actualizar imagen de perfil:', error);
      res.status(500).json({ mensaje: 'Error al actualizar la imagen de perfil' });
    }
  }
}

module.exports = UsuarioController;
