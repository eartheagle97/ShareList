const express = require("express");
const router = express.Router();
const ShoppingList = require("../models/ShoppingList");

router.post("/shopping-lists", async (req, res) => {
  try {
    const { user, name, subItems, collaborators } = req.body;
    // Create a new Shopping List with user information
    const newShoppingList = new ShoppingList({
      user,
      name,
      subItems,
      collaborators,
    });

    // Save the new Shopping List to the database
    const savedShoppingList = await newShoppingList.save();

    res.status(201).json(savedShoppingList);
  } catch (error) {
    console.error("Error creating shopping list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/shopping-lists", async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (userId) {
      // Fetch all shopping lists for the specified user_id
      const shoppingLists = await ShoppingList.find({ user: userId });

      res.status(200).json(shoppingLists);
    }
  } catch (error) {
    console.error("Error fetching shopping lists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/shopping-lists/:listId", async (req, res) => {
  try {
    const { listId } = req.params;
    // Find the shopping list by ID
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    res.json(shoppingList);
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/shopping-lists/:id", async (req, res) => {
  try {
    const listId = req.params.id;

    // Check if the list exists
    const existingList = await ShoppingList.findById(listId);
    if (!existingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    // Perform the delete operation
    await ShoppingList.findByIdAndDelete(listId);

    res.status(200).json({ message: "Shopping list deleted successfully" });
  } catch (error) {
    console.error("Error deleting shopping list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
