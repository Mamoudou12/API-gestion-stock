import prisma from '../config/prisma.js';
import { validateProduct } from '../validators/productValidator.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving products.' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ message: req.t('not_found') });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving product.' });
  }
};

export const createProduct = async (req, res) => {
  try {
    await validateProduct(req, res, () => {});

    const { name, price, stock, category, safetyStock, barcode, userId } = req.body;

    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!userExists) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        stock,
        category,
        safetyStock,
        createdAt: new Date(),
        barcode,
        user: { connect: { id: parseInt(userId) } },
      },
    });

    res.status(201).json({ 
      message: 'Product created successfully.', 
      product: newProduct 
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'The barcode must be unique.' });
    }
    res.status(500).json({ message: 'Error creating product.' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category, safetyStock, barcode } = req.body;

    const productExists = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!productExists) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: price !== undefined ? parseFloat(price) : undefined,
        stock,
        category,
        safetyStock,
        barcode: barcode !== undefined ? barcode : productExists.barcode,
      },
    });

    res.json({
      message: 'Product updated successfully.',
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'The barcode must be unique.' });
    }
    res.status(500).json({ message: 'Error updating product.' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const productExists = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!productExists) {
      return res.status(404).json({ message: req.t('product.not_found') });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(500).json({ message: 'Error deleting product.' });
  }
};
