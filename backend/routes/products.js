const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/products - Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ inStock: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

module.exports = router;
