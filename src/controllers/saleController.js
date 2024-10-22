import prisma from '../config/prisma.js';

// Récupérer toutes les ventes
export const getAllSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: { saleDetails: true, user: true },
    });
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving sales.' });
  }
};

// Récupérer une vente par ID
export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await prisma.sale.findUnique({
      where: { id: parseInt(id) },
      include: { saleDetails: true, user: true },
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

// Créer une nouvelle vente
export const createSale = async (req, res) => {
  try {
    const { totalAmount, firstName, lastName, address, userId, saleDetails } = req.body;

    // Vérifier si l'utilisateur existe
    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!userExists) {
        return res.status(404).json({ message: 'User not found.' });
      }
    }

    // Créer la vente avec les détails associés
    const newSale = await prisma.sale.create({
      data: {
        totalAmount: parseFloat(totalAmount),
        firstName,
        lastName,
        address,
        user: userId ? { connect: { id: parseInt(userId) } } : undefined,
        saleDetails: {
          create: saleDetails, // Les détails sont créés directement
        },
      },
    });

    res.status(201).json({ 
      message: 'Sale created successfully.', 
      sale: newSale 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating sale.' });
  }
};

// Mettre à jour une vente
export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalAmount, firstName, lastName, address, userId, saleDetails } = req.body;

    // Vérifier si la vente existe
    const saleExists = await prisma.sale.findUnique({
      where: { id: parseInt(id) },
    });

    if (!saleExists) {
      return res.status(404).json({ message: 'Sale not found.' });
    }

    // Mettre à jour la vente et les détails
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

    res.json({
      message: 'Sale updated successfully.',
      sale: updatedSale,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating sale.' });
  }
};

// Supprimer une vente
export const deleteSale = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Vérifiez d'abord si la vente existe
      const saleExists = await prisma.sale.findUnique({
        where: { id: parseInt(id) },
        include: { saleDetails: true }, // Incluez les détails pour vérifier
      });
  
      if (!saleExists) {
        return res.status(404).json({ message: 'Sale not found.' });
      }
  
      // Supprimez d'abord les détails de vente
      await prisma.saleDetail.deleteMany({
        where: { saleId: parseInt(id) },
      });
  
      // Supprimez ensuite la vente
      await prisma.sale.delete({
        where: { id: parseInt(id) },
      });
  
      res.status(200).json({ message: 'Sale deleted successfully.' });
    } catch (error) {
      console.error(error);
  
      // Gérez les erreurs spécifiques
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Sale not found.' });
      } else if (error.code === 'P2003') {
        return res.status(400).json({ message: 'Foreign key constraint violated.' });
      } else {
        res.status(500).json({ message: 'Error deleting sale.', error: error.message });
      }
    }
  };
  