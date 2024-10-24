import prisma from "../config/prisma.js";

  
export const createReception = async (req, res) => {
    const { supplierId, userId, detailReceptions } = req.body;
  
    try {
      // Création de la réception avec ses détails
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
  
      // Mise à jour du stock et ajout de mouvements de stock
      for (const detail of detailReceptions) {
        // Mise à jour du stock du produit
        await prisma.product.update({
          where: { id: detail.productId },
          data: {
            stock: {
              increment: detail.quantity, // Ajouter la quantité reçue au stock existant
            },
          },
        });
  
        // Création du mouvement de stock
        await prisma.stockMovement.create({
          data: {
            type: 'In',
            quantity: detail.quantity, // Quantité reçue
            movementDate: new Date(), // Date du mouvement
            entity: 'Reception',
            productId: detail.productId,
            userId: userId || null, // L'utilisateur qui a enregistré le mouvement
          },
        });
      }
  
      res.status(201).json({
        message: "Reception created successfully.",
        reception,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating reception. Please try again." });
    }
  };
  
// Récupérer toutes les réceptions
export const getReceptions = async (req, res) => {
  try {
    const receptions = await prisma.reception.findMany({
      include: {
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

export const updateReception = async (req, res) => {
    const { id } = req.params;
    const { supplierId, userId, detailReceptions } = req.body;
  
    try {
      // Vérifier si la réception existe
      const receptionExists = await prisma.reception.findUnique({
        where: { id: Number(id) },
        include: { detailReceptions: true }, // Récupérer les détails existants
      });
  
      if (!receptionExists) {
        return res
          .status(404)
          .json({ message: `Reception with ID ${id} not found.` });
      }
  
      const existingDetails = receptionExists.detailReceptions;
  
      // 1. Annuler les anciens mouvements de stock et ajuster les stocks
      for (const existing of existingDetails) {
        await prisma.product.update({
          where: { id: existing.productId },
          data: {
            stock: { decrement: existing.quantity }, // Retirer la quantité de l'ancien mouvement
          },
        });
  
        await prisma.stockMovement.create({
          data: {
            type: 'Out', // Mouvement de sortie pour annuler l'ancien
            quantity: existing.quantity,
            movementDate: new Date(),
            entity: 'ReceptionUpdate',
            productId: existing.productId,
            userId: userId || null,
          },
        });
      }
  
      // 2. Supprimer les anciens détails qui ne sont plus nécessaires
      const detailsToDelete = existingDetails.filter(
        (existing) =>
          !detailReceptions.some((detail) => detail.id === existing.id)
      );
      await prisma.detailReception.deleteMany({
        where: {
          id: { in: detailsToDelete.map((detail) => detail.id) },
        },
      });
  
      // 3. Mettre à jour les détails existants
      for (const detail of detailReceptions) {
        if (detail.id) {
          const updatedDetail = await prisma.detailReception.update({
            where: { id: detail.id },
            data: {
              productId: detail.productId,
              quantity: detail.quantity,
              price: detail.price,
            },
          });
  
          // Mise à jour du stock et création d'un mouvement
          await prisma.product.update({
            where: { id: detail.productId },
            data: {
              stock: { increment: detail.quantity }, // Ajouter la nouvelle quantité au stock
            },
          });
  
          await prisma.stockMovement.create({
            data: {
              type: 'In', // Mouvement de réception
              quantity: detail.quantity,
              movementDate: new Date(),
              entity: 'ReceptionUpdate',
              productId: detail.productId,
              userId: userId || null,
            },
          });
        }
      }
  
      // 4. Ajouter les nouveaux détails
      const newDetails = detailReceptions.filter((detail) => !detail.id);
      await prisma.detailReception.createMany({
        data: newDetails.map((detail) => ({
          receptionId: Number(id),
          productId: detail.productId,
          quantity: detail.quantity,
          price: detail.price,
        })),
      });
  
      // Ajouter les mouvements de stock pour les nouveaux détails
      for (const detail of newDetails) {
        await prisma.product.update({
          where: { id: detail.productId },
          data: {
            stock: { increment: detail.quantity },
          },
        });
  
        await prisma.stockMovement.create({
          data: {
            type: 'In',
            quantity: detail.quantity,
            movementDate: new Date(),
            entity: 'Reception',
            productId: detail.productId,
            userId: userId || null,
          },
        });
      }
  
      // 5. Mettre à jour la réception
      const updatedReception = await prisma.reception.update({
        where: { id: Number(id) },
        data: {
          supplierId,
          userId,
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
      res.status(500).json({ error: 'Error updating reception.' });
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