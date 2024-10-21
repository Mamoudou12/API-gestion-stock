// controllers/userController.js
import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

class UserController {
  static async createUser(req, res) {
    const { name, email, password, role } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });
      res.status(201).json({ message: "User created successfully.", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating user." });
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error retrieving users." });
    }
  }

  static async getUserById(req, res) {
    const { id } = req.params;

    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error retrieving user." });
    }
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const data = {
      name,
      email,
      role,
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    try {
      // Vérifiez si l'utilisateur existe
      const userExists = await prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!userExists) {
        return res.status(404).json({ message: "User not found." });
      }

      // Mettez à jour l'utilisateur
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data,
      });

      res
        .status(200)
        .json({ message: "User updated successfully.", user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating user." });
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params;

    try {
      // Vérifiez si l'utilisateur existe
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!userExists) {
        return res.status(404).json({ message: "User not found." });
      }

      // Supprimez l'utilisateur
      await prisma.user.delete({
        where: { id: parseInt(id) },
      });

      // Renvoie un message de confirmation
      res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(500).json({ message: "Error deleting user." });
    }
  }
}

export default UserController;
