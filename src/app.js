import express from "express"

const app = express()
const PORT = 3000
app.use(express.json())

app.use('/', tasksRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Tareas funcionando');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});