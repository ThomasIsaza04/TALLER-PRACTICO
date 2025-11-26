import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que vengan email y password
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email y password son requeridos' 
            });
        }

        // Buscar usuario en la BD
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ 
                message: 'Credenciales inválidas' 
            });
        }

        // Comparar la contraseña con bcrypt
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ 
                message: 'Credenciales inválidas' 
            });
        }

        // Si es correcto, generar JWT
        const token = jwt.sign(
            { 
                sub: user._id,
                userId: user._id,
                email: user.email 
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: '24h' // tiempo de expiración
            }
        );

        // Devolver el token al cliente
        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            message: 'Error en el servidor' 
        });
    }
});

export default router;