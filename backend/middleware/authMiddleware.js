const jwt = require('jsonwebtoken');
const config = require('../config');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ mensaje: 'No se proporcionó token de autenticación' });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ mensaje: 'Token expirado' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ mensaje: 'Token inválido' });
        }
        console.error('Error en autenticación:', error);
        res.status(500).json({ mensaje: 'Error en la autenticación' });
    }
};

module.exports = authMiddleware; 