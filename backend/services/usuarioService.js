// services/usuarioService.js
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UsuarioService {
  static async crearUsuario(data) {
    try {
      // Encriptar la contraseña antes de guardar
      data.contrasena = await bcrypt.hash(data.contrasena, 8);
      const usuario = await Usuario.create(data);
      return usuario;
    } catch (error) {
      throw new Error('Error al crear usuario: ' + error.message);
    }
  }

  static async obtenerUsuarios() {
    try {
      const usuarios = await Usuario.findAll();
      return usuarios;
    } catch (error) {
      throw new Error('Error al obtener usuarios: ' + error.message);
    }
  }

  static async obtenerUsuarioPorId(id) {
    try {
      const usuario = await Usuario.findByPk(id);
      return usuario;
    } catch (error) {
      throw new Error('Error al obtener usuario: ' + error.message);
    }
  }

  static async actualizarUsuario(id, data) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return null;
      await usuario.update(data);
      return usuario;
    } catch (error) {
      throw new Error('Error al actualizar usuario: ' + error.message);
    }
  }

  static async eliminarUsuario(id) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return null;
      await usuario.destroy();
      return true;
    } catch (error) {
      throw new Error('Error al eliminar usuario: ' + error.message);
    }
  }

  // Nueva función para autenticar al usuario
  static async autenticarUsuario(correo, contrasena) {
    if (!correo || !contrasena) {
      throw new Error('Correo y contraseña son requeridos');
    }

    try {
      const usuario = await Usuario.findOne({ where: { correo } });
      if (!usuario) {
        throw new Error('Correo o contraseña incorrectos');
      }

      const esContraseñaValida = await bcrypt.compare(contrasena, usuario.contrasena);
      if (!esContraseñaValida) {
        throw new Error('Correo o contraseña incorrectos');
      }

      // Generar JWT
      const token = jwt.sign(
        { id: usuario.id_usuario, tipo_usuario: usuario.tipo_usuario },
        'tu_secreto_jwt',
        { expiresIn: '1h' }
      );
      return { usuario, token };
    } catch (error) {
      throw new Error('Error de autenticación: ' + error.message);
    }
  }
}

module.exports = UsuarioService;
