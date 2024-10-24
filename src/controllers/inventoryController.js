import prisma from "../config/prisma.js";

// Ajouter un inventaire
export const createInventory = async (req, res) => {
  const { quantity, remarks, userId, productId } = req.body;

  try {
    const inventory = await prisma.inventory.create({
      data: {
        quantity,
        remarks,
        userId,
        productId,
      },
    });

    res.status(201).json({
      message: "Inventory entry created successfully.",
      inventory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating inventory entry." });
  }
};

// Récupérer tous les inventaires
export const getInventories = async (req, res) => {
  try {
    const inventories = await prisma.inventory.findMany({
      include: { user: true, product: true },
    });

    res.status(200).json({
      message: `${inventories.length} inventory entries retrieved successfully.`,
      inventories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving inventories." });
  }
};

// Récupérer un inventaire par ID
export const getInventoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id: Number(id) },
      include: { user: true, product: true },
    });

    if (!inventory) {
      return res.status(404).json({ message: `Inventory with ID ${id} not found.` });
    }

    res.status(200).json({
      message: `Inventory with ID ${id} retrieved successfully.`,
      inventory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving inventory." });
  }
};

// Mettre à jour un inventaire
export const updateInventory = async (req, res) => {
  const { id } = req.params;
  const { quantity, remarks, userId, productId } = req.body;

  try {
    const inventoryExists = await prisma.inventory.findUnique({
      where: { id: Number(id) },
    });

    if (!inventoryExists) {
      return res.status(404).json({ message: `Inventory with ID ${id} not found.` });
    }

    const updatedInventory = await prisma.inventory.update({
      where: { id: Number(id) },
      data: { quantity, remarks, userId, productId },
    });

    res.status(200).json({
      message: `Inventory with ID ${id} updated successfully.`,
      inventory: updatedInventory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating inventory." });
  }
};

// Supprimer un inventaire
export const deleteInventory = async (req, res) => {
  const { id } = req.params;

  try {
    const inventoryExists = await prisma.inventory.findUnique({
      where: { id: Number(id) },
    });

    if (!inventoryExists) {
      return res.status(404).json({ message: `Inventory with ID ${id} not found.` });
    }

    await prisma.inventory.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      message: `Inventory with ID ${id} deleted successfully.`,
    });
  } catch (error) {
    console.error(error);
    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Cannot delete inventory due to existing foreign key dependencies.",
      });
    }
    res.status(500).json({ error: "Error deleting inventory." });
  }
};
