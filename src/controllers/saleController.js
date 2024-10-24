import prisma from '../config/prisma.js';

// Helper function to check stock
const checkStock = async (saleDetails) => {
  for (const detail of saleDetails) {
    const product = await prisma.product.findUnique({
      where: { id: detail.productId },
    });
    if (!product || product.stock < detail.quantity) {
      throw new Error(`Insufficient stock for product ${detail.productId}.`);
    }
  }
};

// Helper function to restore stock
const restoreStock = async (saleDetails) => {
  for (const detail of saleDetails) {
    await prisma.product.update({
      where: { id: detail.productId },
      data: { stock: { increment: detail.quantity } },
    });
  }
};

// Get all sales
export const getAllSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: { saleDetails: true },
    });
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving sales.' });
  }
};

// Get sale by ID
export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await prisma.sale.findUnique({
      where: { id: parseInt(id) },
      include: { saleDetails: true },
    });
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found.' });
    }
    res.json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving sale.' });
  }
};

// Create a sale and decrement stock
export const createSale = async (req, res) => {
  try {
    const { totalAmount, firstName, lastName, address, userId, saleDetails } = req.body;

    // Check if user exists
    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });
      if (!userExists) {
        return res.status(404).json({ message: 'User not found.' });
      }
    }

    // Check stock available
    await checkStock(saleDetails);

    // Create sale with details
    const newSale = await prisma.sale.create({
      data: {
        totalAmount: parseFloat(totalAmount),
        firstName,
        lastName,
        address,
        user: userId ? { connect: { id: parseInt(userId) } } : undefined,
        saleDetails: { create: saleDetails },
      },
    });

    // Decrement stock of sold products
    for (const detail of saleDetails) {
      await prisma.product.update({
        where: { id: detail.productId },
        data: { stock: { decrement: detail.quantity } },
      });
    }
    

    res.status(201).json({
      message: 'Sale created successfully.',
      sale: newSale,
    });
  } catch (error) {
    console.error(error);
    res.status(error.message.includes('Insufficient stock') ? 400 : 500).json({ message: error.message });
  }
};

// Update sale and adjust stock
export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalAmount, firstName, lastName, address, userId, saleDetails } = req.body;

    const existingSale = await prisma.sale.findUnique({
      where: { id: parseInt(id) },
      include: { saleDetails: true },
    });

    if (!existingSale) {
      return res.status(404).json({ message: 'Sale not found.' });
    }

    // Restore stock of the existing sale
    await restoreStock(existingSale.saleDetails);

    // Check stock for new quantities
    if (saleDetails) {
      await checkStock(saleDetails);
    }

    // Update sale
    const updatedSale = await prisma.sale.update({
      where: { id: parseInt(id) },
      data: {
        totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
        firstName,
        lastName,
        address,
        user: userId ? { connect: { id: parseInt(userId) } } : undefined,
        saleDetails: saleDetails ? { create: saleDetails } : undefined,
      },
    });

    // Decrement stock for new quantities
    for (const detail of saleDetails || []) {
      await prisma.product.update({
        where: { id: detail.productId },
        data: { stock: { decrement: detail.quantity } },
      });
    }

    res.json({
      message: 'Sale updated successfully.',
      sale: updatedSale,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating sale.' });
  }
};

// Delete a sale and restore stock
export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if sale exists
    const saleExists = await prisma.sale.findUnique({
      where: { id: parseInt(id) },
      include: { saleDetails: true },
    });

    if (!saleExists) {
      return res.status(404).json({ message: 'Sale not found.' });
    }

    // Restore stock of the products before deletion
    await restoreStock(saleExists.saleDetails);

    // Delete sale details
    await prisma.saleDetail.deleteMany({
      where: { saleId: parseInt(id) },
    });

    // Delete the sale
    await prisma.sale.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Sale deleted successfully.' });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Sale not found.' });
    }
    res.status(500).json({ message: 'Error deleting sale.', error: error.message });
  }
};
