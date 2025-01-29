const UsuarioService = require('../services/usuarioService');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'tu_clave_secreta'; // Usa una clave segura y mantenla en secreto

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

      // Generar el token JWT con expiración de 2 minutos
      const token = jwt.sign(
          { id: usuario.id, correo: usuario.correo }, // Payload
          SECRET_KEY, // Clave secreta
          { expiresIn: '2m' } // Expiración de 2 minutos
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
      const { id_usuario, nombre, telefono, correo } = req.body; // Puedes incluir otros campos necesarios

      const usuarioActualizado = await UsuarioService.actualizarUsuario(id_usuario, { nombre, telefono, correo });

      if (!usuarioActualizado) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Perfil actualizado correctamente', usuario: usuarioActualizado });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = UsuarioController;
