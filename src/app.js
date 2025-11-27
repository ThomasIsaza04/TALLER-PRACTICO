import express from "express";
import authRoutes from "./routes/auth.js";
import tasksRoutes from "./routes/tasks.js";
import cors from "cors";
import rateLimit from "express-rate-limit";
import passport from "./config/passport.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// CORS
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
app.use(
  cors({
    origin: FRONTEND_ORIGIN || "*",
  })
);

// Passport
app.use(passport.initialize());

// RATE LIMITERS
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const tasksLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
});

app.use("/auth", authLimiter);
app.use("/tasks", tasksLimiter);

// Rutas
app.use("/auth", authRoutes);
app.use("/tasks", tasksRoutes);

app.get("/", (req, res) => {
  res.send("API de Tareas funcionando");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
