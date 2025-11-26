import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";


const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios" });
    }

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res
        .status(409)
        .json({ error: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que vengan email y password
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email y password son requeridos' 
            });
        }

        // Buscar usuario en la BD
       const user = await prisma.user.findUnique({ where: { email } });

        
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
                sub: user.id,
                email: user.email, 
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: '24h'
            }
        );

        // Devolver el token al cliente
        return res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            message: 'Error en el servidor',
            error: error.message 
        });
    }
};