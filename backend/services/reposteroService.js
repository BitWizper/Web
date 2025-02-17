const Repostero = require('../models/Repostero');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

class ReposteroService {
  static async crearRepostero(data) {
    try {
      const { userData, reposteroData } = data;

      // Verificar si el correo ya está registrado
      const usuarioExistente = await Usuario.findOne({ where: { correo: userData.correo } });
      if (usuarioExistente) {
        throw new Error('El correo ya está en uso.');
      }

      // Encriptar la contraseña antes de guardar
      const hashedPassword = await bcrypt.hash(userData.contrasena, 10);

      // Crear el usuario en la base de datos
      const nuevoUsuario = await Usuario.create({
        nombre: userData.nombre,
        correo: userData.correo,
        contrasena: hashedPassword,
        direccion: userData.direccion,
        telefono: userData.telefono,
        tipo_usuario: 'Repostero' // Establecer el tipo de usuario como "Repostero"
      });

      // Crear el repostero asociado al usuario
      const nuevoRepostero = await Repostero.create({
        id_usuario: nuevoUsuario.id_usuario,
        NombreNegocio: reposteroData.NombreNegocio,
        Ubicacion: reposteroData.Ubicacion,
        Especialidades: reposteroData.Especialidades,
        PortafolioURL: reposteroData.PortafolioURL
      });

      return { usuario: nuevoUsuario, repostero: nuevoRepostero };

    } catch (error) {
      throw new Error('Error al crear repostero: ' + error.message);
    }
  }

  static async obtenerReposteros() {
    try {
      const reposteros = await Repostero.findAll();
      return reposteros;
    } catch (error) {
      throw new Error('Error al obtener reposteros: ' + error.message);
    }
  }

  static async obtenerReposteroPorId(id) {
    try {
      const repostero = await Repostero.findByPk(id);
      return repostero;
    } catch (error) {
      throw new Error('Error al obtener repostero: ' + error.message);
    }
  }

  static async actualizarRepostero(id, data) {
    try {
      const repostero = await Repostero.findByPk(id);
      if (!repostero) return null;
      await repostero.update(data);
      return repostero;
    } catch (error) {
      throw new Error('Error al actualizar repostero: ' + error.message);
    }
  }

  static async eliminarRepostero(id) {
    try {
      const repostero = await Repostero.findByPk(id);
      if (!repostero) return null;
      await repostero.destroy();
      return true;
    } catch (error) {
      throw new Error('Error al eliminar repostero: ' + error.message);
    }
  }
}

module.exports = ReposteroService;
