const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
};


const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const newTask = await prisma.task.create({
      data: {
        title,
        description: description || null,
      },
    });
    
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        completed,
      },
    });
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
};


const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.task.delete({
      where: { id: parseInt(id) },
    });
    
    res.status(200).json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};