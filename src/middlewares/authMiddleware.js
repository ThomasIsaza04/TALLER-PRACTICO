import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ 
                message: 'Token no proporcionado' 
            });
        }

        // El formato es: "Bearer <token>"
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                message: 'Formato de token inválido' 
            });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adjuntar la información del usuario a req.user
        req.user = {
            userId: decoded.sub,
            email: decoded.email
        };

        // Continuar con la siguiente función
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Token inválido' 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expirado' 
            });
        }

        console.error('Error en autenticación:', error);
        res.status(500).json({ 
            message: 'Error en el servidor' 
        });
    }
};