import express from "express"
import authRoutes from "./routes/auth.js";
import tasksRoutes from "./routes/tasks.js"; 

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('API de Tareas funcionando');
});

app.use("/auth", authRoutes);


app.use('/', tasksRoutes);

// Ruta de prueba

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;