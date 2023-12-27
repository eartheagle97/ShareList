const mongoose = require("mongoose");

// Define the subItem schema
const subItemSchema = new mongoose.Schema({
  name: String,
  qty: String,
  qtyUnit: String,
  notes: String,
  purchased: Boolean,
});

// Define the shopping list schema
const shoppingListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  subItems: [subItemSchema],
  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

// Create the shopping list model
const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);

module.exports = ShoppingList;
