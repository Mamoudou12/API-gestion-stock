import prisma from '../config/prisma.js';
import { validateSupplier, handleValidationErrors } from '../validators/supplierValidator.js';

// Récupérer tous les fournisseurs
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    res.json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving suppliers.' });
  }
};

// Récupérer un fournisseur par ID
export const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await prisma.supplier.findUnique({
      where: { id: parseInt(id) },
    });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    res.json(supplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving supplier.' });
  }
};

// Créer un nouveau fournisseur
export const createSupplier = async (req, res) => {
  try {
    // Valider les données d'entrée
    await handleValidationErrors(req, res, () => {});

    const { email, phone, address, userId } = req.body;

    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!userExists) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const newSupplier = await prisma.supplier.create({
      data: {
        email,
        phone,
        address,
        user: { connect: { id: parseInt(userId) } },
      },
    });

    res.status(201).json({
      message: 'Supplier created successfully.',
      supplier: newSupplier,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'The email or phone must be unique.' });
    }
    res.status(500).json({ message: 'Error creating supplier.' });
  }
};

// Mettre à jour un fournisseur
export const updateSupplier = async (req, res) => {
  try {
    // Valider les données d'entrée
    await handleValidationErrors(req, res, () => {});

    const { id } = req.params;
    const { email, phone, address } = req.body;

    const supplierExists = await prisma.supplier.findUnique({
      where: { id: parseInt(id) },
    });

    if (!supplierExists) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    const updatedSupplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: {
        email: email !== undefined ? email : supplierExists.email,
        phone: phone !== undefined ? phone : supplierExists.phone,
        address: address !== undefined ? address : supplierExists.address,
      },
    });

    res.json({
      message: 'Supplier updated successfully.',
      supplier: updatedSupplier,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'The email or phone must be unique.' });
    }
    res.status(500).json({ message: 'Error updating supplier.' });
  }
};

// Supprimer un fournisseur
export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplierExists = await prisma.supplier.findUnique({
      where: { id: parseInt(id) },
    });

    if (!supplierExists) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    await prisma.supplier.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Supplier deleted successfully.' });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Supplier not found.' });
    }
    res.status(500).json({ message: 'Error deleting supplier.' });
  }
};
