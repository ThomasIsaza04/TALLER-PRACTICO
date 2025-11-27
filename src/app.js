import express from "express"
import authRoutes from "./routes/auth.js";
import tasksRoutes from "./routes/tasks.js"; 
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('API de Tareas funcionando');
});

app.use("/auth", authRoutes);


app.use('/', tasksRoutes);

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

app.use(
  cors({
    origin: FRONTEND_ORIGIN || "*", // ⚠️ En producción NO usar "*"
  })
);


const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/auth", authLimiter);


const tasksLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 60, 
});

app.use("/tasks", tasksLimiter);

// Ruta de prueba

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;