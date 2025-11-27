import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Opciones de la estrategia: de dónde sale el token y con qué clave se verifica
const jwtOptions = {
  // Extrae el token del header Authorization: Bearer <token>
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // misma clave que usas en tu middleware personalizado
};

// Estrategia JWT de Passport:
// 1. Recibe el payload del token
// 2. Busca el usuario en la BD
// 3. Si existe, lo adjunta a req.user; si no, rechaza la autenticación
passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      // Ajusta el campo según tu modelo (id, userId, email, etc.)
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        // No se encontró usuario → no autenticado
        return done(null, false);
      }

      // Usuario encontrado → se adjunta en req.user
      return done(null, user);
    } catch (error) {
      // Error al consultar la BD
      return done(error, false);
    }
  })
);

// Exportamos la instancia de passport ya configurada
export default passport;
