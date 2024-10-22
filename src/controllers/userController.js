import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

// Créer un utilisateur
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    res.status(201).json({
      message: `User ${name} created successfully.`,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user. Please try again." });
  }
};

// Récupérer tous les utilisateurs
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({
      message: `${users.length} user(s) retrieved successfully.`,
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving users." });
  }
};

// Récupérer un utilisateur par ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).json({ message: `User with ID ${id} not found.` });
    }

    res.status(200).json({
      message: `User with ID ${id} retrieved successfully.`,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving user." });
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  const data = { name, email, role };

  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!userExists) {
      return res.status(404).json({ message: `User with ID ${id} not found.` });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json({
      message: `User with ID ${id} updated successfully.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating user." });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!userExists) {
      return res.status(404).json({ message: `User with ID ${id} not found.` });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      message: `User with ID ${id} deleted successfully.`,
    });
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: `User with ID ${id} not found.` });
    }
    res.status(500).json({ message: "Error deleting user." });
  }
};
