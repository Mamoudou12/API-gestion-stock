import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthController {
  static async register(req, res) {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role },
      });
      res.status(201).json({ message: 'User registered successfully.', user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: 'Invalid email or password.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default AuthController;
