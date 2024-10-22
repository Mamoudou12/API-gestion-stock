import prisma from "../config/prisma.js";

// Créer une réception
export const createReception = async (req, res) => {
  const { supplierId, userId, detailReceptions } = req.body;

  try {
    const reception = await prisma.reception.create({
      data: {
        supplierId,
        userId: userId || null, // Null si non fourni
        detailReceptions: {
          create: detailReceptions.map((detail) => ({
            productId: detail.productId,
            quantity: detail.quantity,
            price: detail.price, // Inclure 'price'
          })),
        },
      },
    });

    res.status(201).json({
      message: "Reception created successfully.",
      reception,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error creating reception. Please try again." });
  }
};
// Récupérer toutes les réceptions
export const getReceptions = async (req, res) => {
  try {
    const receptions = await prisma.reception.findMany({
      include: {
        supplier: true,
        user: true,
        detailReceptions: true,
      },
    });
    res.status(200).json({
      message: `${receptions.length} reception(s) retrieved successfully.`,
      receptions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving receptions." });
  }
};

// Récupérer une réception par ID
export const getReceptionById = async (req, res) => {
  const { id } = req.params;

  try {
    const reception = await prisma.reception.findUnique({
      where: { id: Number(id) },
      include: {
        supplier: true,
        user: true,
        detailReceptions: true,
      },
    });

    if (!reception) {
      return res
        .status(404)
        .json({ message: `Reception with ID ${id} not found.` });
    }

    res.status(200).json({
      message: `Reception with ID ${id} retrieved successfully.`,
      reception,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving reception." });
  }
};

// Mettre à jour une réception
export const updateReception = async (req, res) => {
  const { id } = req.params;
  const { supplierId, userId, detailReceptions } = req.body;

  try {
    const receptionExists = await prisma.reception.findUnique({
      where: { id: Number(id) },
    });

    if (!receptionExists) {
      return res
        .status(404)
        .json({ message: `Reception with ID ${id} not found.` });
    }

    const updatedReception = await prisma.reception.update({
      where: { id: Number(id) },
      data: {
        supplierId,
        userId,
        detailReceptions: {
          deleteMany: {}, // Supprimer les anciens détails
          create: detailReceptions, // Créer les nouveaux détails
        },
      },
      include: {
        supplier: true,
        user: true,
        detailReceptions: true,
      },
    });

    res.status(200).json({
      message: `Reception with ID ${id} updated successfully.`,
      reception: updatedReception,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating reception." });
  }
};

export const deleteReception = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Supprimer les DetailReceptions liés à cette réception
      await prisma.detailReception.deleteMany({
        where: { receptionId: parseInt(id) },
      });
  
      // Supprimer la réception une fois les dépendances supprimées
      const reception = await prisma.reception.delete({
        where: { id: parseInt(id) },
      });
  
      res.status(200).json({
        message: 'Reception deleted successfully.',
        reception,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting reception. Please try again.' });
    }
  };