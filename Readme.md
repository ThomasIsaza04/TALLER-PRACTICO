# Taller Práctico - Sistema de Autenticación y Gestión de Tareas

## Descripción del Proyecto

Este proyecto es un sistema backend completo que implementa autenticación de usuarios y gestión de tareas con diferentes niveles de seguridad. Desarrollado con Node.js, Express, Prisma ORM y PostgreSQL.

### Características Principales

- **Autenticación segura** con JWT (JSON Web Tokens)
- **Autorización** basada en roles (USER y ADMIN)
- **Gestión de tareas** con CRUD completo
- **Rate limiting** para protección contra ataques de fuerza bruta
- **CORS** configurado para seguridad en peticiones cross-origin
- **Passport.js** para estrategias de autenticación
- **Base de datos PostgreSQL** con Prisma ORM

---

## Pasos para Clonar, Instalar Dependencias y Correr Migraciones

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd taller-practico
```

### 2. Instalar Dependencias

```bash
npm install
```

Las principales dependencias incluyen:
- `express` - Framework web
- `@prisma/client` - Cliente de Prisma ORM
- `passport` y `passport-jwt` - Autenticación
- `bcrypt` - Hash de contraseñas
- `jsonwebtoken` - Generación de tokens JWT
- `express-rate-limit` - Limitación de peticiones
- `cors` - Manejo de CORS
- `dotenv` - Variables de entorno

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db"
JWT_SECRET="tu_clave_secreta_muy_segura"
PORT=3000
NODE_ENV=development
```

### 4. Ejecutar Migraciones de Prisma

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio para ver la base de datos
npx prisma studio
```

### 5. Iniciar el Servidor

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

---

## Variables de Entorno Necesarias

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://user:pass@localhost:5432/dbname` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | `mi_clave_super_secreta_123` |
| `PORT` | Puerto donde correrá el servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` o `production` |

---

## Resumen de Cómo Funciona la Seguridad

### 🔐 Flujo de Registro → Login → Uso de Token

#### 1. **Registro de Usuario** (`POST /auth/register`)
- El usuario envía `email`, `password` y opcionalmente `role`
- La contraseña se hashea con **bcrypt** (10 rounds)
- Se crea el usuario en la base de datos
- Se retorna un JWT firmado con el `JWT_SECRET`

**Ejemplo de request:**
```json
{
  "email": "usuario@example.com",
  "password": "MiPassword123!",
  "role": "USER"
}
```

#### 2. **Login** (`POST /auth/login`)
- El usuario envía `email` y `password`
- Se verifica que el usuario existe y la contraseña coincide (bcrypt.compare)
- **Rate Limiting aplicado**: Máximo 5 intentos por IP cada 15 minutos
- Si es exitoso, se genera un nuevo JWT
- El token contiene: `{ userId, email, role }`

**Ejemplo de request:**
```json
{
  "email": "usuario@example.com",
  "password": "MiPassword123!"
}
```

**Ejemplo de response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "usuario@example.com",
    "role": "USER"
  }
}
```

#### 3. **Uso del Token en `/tasks`**
Para acceder a rutas protegidas, el cliente debe incluir el token en el header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Flujo de autenticación:**
1. El middleware de Passport intercepta la petición
2. Extrae el token del header `Authorization`
3. Verifica la firma del token con `JWT_SECRET`
4. Decodifica el payload y obtiene el `userId`
5. Busca el usuario en la base de datos
6. Inyecta el objeto `user` en `req.user`
7. Continúa con el controlador de la ruta

---

### 🛡️ Rate Limit - Protección contra Ataques de Fuerza Bruta

**Configuración en `/auth/login`:**

```javascript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos máximo
  message: "Demasiados intentos de login, intenta de nuevo en 15 minutos"
});
```

**¿Dónde está configurado?**
- En `src/middlewares/authMiddleware.js`
- Aplicado específicamente a la ruta `POST /auth/login`

**Beneficios:**
- Previene ataques de fuerza bruta
- Protege las credenciales de los usuarios
- Limita el impacto de intentos automatizados de login

---

### 🌐 CORS - Cross-Origin Resource Sharing

**Configuración en `src/config/config.js`:**

```javascript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

**¿Dónde está configurado?**
- En el archivo `src/config/config.js`
- Aplicado globalmente en `src/app.js` con `app.use(cors(corsOptions))`

**¿Qué hace?**
- Permite peticiones solo desde orígenes autorizados
- Habilita el envío de credenciales (cookies, headers de autorización)
- Protege contra peticiones maliciosas desde dominios no autorizados

---

### 🔑 Cómo se Usa Passport

**Estrategia JWT configurada en `src/config/passport.js`:**

```javascript
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(options, async (payload, done) => {
  // Buscar usuario por ID del payload
  // Retornar usuario autenticado
}));
```

**¿Dónde se aplica?**
- En las rutas de `/tasks` con el middleware `passport.authenticate('jwt', { session: false })`
- Ejemplo en `src/routes/tasks.js`

**Flujo:**
1. Passport extrae el token del header `Authorization: Bearer <token>`
2. Verifica la firma con `JWT_SECRET`
3. Ejecuta la estrategia que busca el usuario en la DB
4. Inyecta `req.user` con los datos del usuario autenticado

---

## Verificaciones Finales

### ✅ No se subió `.env` al repositorio
- El archivo `.env` está incluido en `.gitignore`
- Solo se sube `.env.example` como plantilla

### ✅ Revisión rápida de consola (sin errores al iniciar el proyecto)

```bash
npm start
```

Deberías ver:
```
Servidor corriendo en puerto 3000
Base de datos conectada exitosamente
```

**Sin errores de:**
- Conexión a base de datos
- Variables de entorno faltantes
- Dependencias no instaladas

---

## Endpoints Disponibles

### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión (con rate limiting)

### Tareas (requieren autenticación)
- `GET /tasks` - Obtener todas las tareas del usuario
- `POST /tasks` - Crear nueva tarea
- `PUT /tasks/:id` - Actualizar tarea
- `DELETE /tasks/:id` - Eliminar tarea

---

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **Prisma** - ORM
- **JWT** - Autenticación
- **Passport.js** - Estrategias de autenticación
- **Bcrypt** - Hashing de contraseñas
- **Express Rate Limit** - Protección contra fuerza bruta
- **CORS** - Seguridad cross-origin

---

## Estructura del Proyecto

```
taller-practico/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   ├── config.js
│   │   └── passport.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── tasksController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---


