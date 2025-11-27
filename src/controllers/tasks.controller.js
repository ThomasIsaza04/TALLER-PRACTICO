import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user.id   // <-- CORREGIDO
      }
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: "Error al obtener las tareas" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'El título es requerido' });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description: description || null,
        userId: req.user.id  // <-- CORREGIDO
      },
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: "Error al crear la tarea" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const task = await prisma.task.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id   // <-- CORREGIDO
      }
    });

    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

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
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ error: "Error al actualizar la tarea" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id   // <-- CORREGIDO
      }
    });

    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    await prisma.task.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Tarea eliminada exitosamente" });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: "Error al eliminar la tarea" });
  }
};
