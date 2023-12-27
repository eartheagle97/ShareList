const express = require("express");
const router = express.Router();
const ShoppingList = require("../models/ShoppingList");
const User = require("../models/User");

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

router.get("/shopping-lists/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId) {
      // Fetch all shopping lists for the specified user_id
      const shoppingLists = await ShoppingList.find({
        $or: [{ user: userId }, { collaborators: userId }],
      });

      return res.status(200).json(shoppingLists);
    }

    return res.status(400).json({ error: "User ID is required" });
  } catch (error) {
    console.error("Error fetching shopping lists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/shopping-lists/:listId", async (req, res) => {
  try {
    const { listId } = req.params;
    // Find the shopping list by ID
    const updatedshoppingList = await ShoppingList.findById(listId);

    if (!updatedshoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    const populatedShoppingList = await ShoppingList.findById(listId)
      .populate("collaborators", "firstName lastName email")
      .exec();

    const collabUser = populatedShoppingList.collaborators;

    res.status(200).json({ updatedshoppingList, collabUser });
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/shopping-lists/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Find the shopping list by ID
    const updatedShoppingList = await ShoppingList.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // Respond with the updated shopping list
    res.status(200).json(updatedShoppingList);
  } catch (error) {
    console.error("Error updating shopping list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/shopping-lists/collaborators/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail, currentUser } = req.body;

    // Find the shopping list by ID
    const shoppingList = await ShoppingList.findById(id);

    // Check if the shopping list exists
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    // Check if the user is already a collaborator
    if (shoppingList.collaborators.includes(user._id)) {
      return res.status(400).json({ error: "User is already a collaborator" });
    }

    if (user._id.equals(currentUser)) {
      return res.status(404).json({ error: "You can't add yourself." });
    }

    // Add the collaborator to the shopping list
    shoppingList.collaborators.push(user._id);

    // Save the updated shopping list document to the database
    const updatedShoppingList = await shoppingList.save();

    const populatedShoppingList = await ShoppingList.findById(id)
      .populate("collaborators", "firstName lastName email")
      .exec();

    const collabUser = populatedShoppingList.collaborators;

    // Send a success response if everything is okay
    res.status(200).json({
      message: "Collaborator added successfully",
      updatedShoppingList,
      collabUser,
    });
  } catch (error) {
    console.error("Error adding collaborator:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/shopping-lists/collaborators/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Find the shopping list by ID
    const shoppingList = await ShoppingList.findById(id);

    // Check if the shopping list exists
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    const populatedShoppingList = await ShoppingList.findById(id)
      .populate("collaborators", "firstName lastName email")
      .exec();

    const collabUser = populatedShoppingList.collaborators;

    // Send a success response if everything is okay
    res.status(200).json({
      collabUser,
    });
  } catch (error) {
    console.error("Error finding collaborator:", error);
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

router.delete("/shopping-lists/collaborators/:id/:UserId", async (req, res) => {
  try {
    const { id, UserId } = req.params;

    if (!UserId) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the shopping list containing the collaborator and pull the collaborator's ObjectId
    const updatedShoppingList = await ShoppingList.findOneAndUpdate(
      { collaborators: UserId },
      { $pull: { collaborators: UserId } },
      { new: true }
    );

    if (!updatedShoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    const populatedShoppingList = await ShoppingList.findById(id)
      .populate("collaborators", "firstName lastName email")
      .exec();

    const collabUser = populatedShoppingList.collaborators;

    res.status(200).json({
      message: "User deleted successfully",
      updatedShoppingList,
      collabUser,
    });
  } catch (error) {
    console.error("Error adding collaborator:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
