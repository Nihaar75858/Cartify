const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: 'User-123' });
    if (!cart) {
      cart = new Cart({ userId: 'User-123', items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product');

    res.json({
      message: 'Item added to cart',
      cart: {
        items: cart.items,
        total: cart.total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

router.get('/', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: 'User-123' })
      .populate('items.product');
    
    if (!cart) {
      cart = new Cart({ userId: 'User-123', items: [] });
      await cart.save();
    }

    res.json({
      items: cart.items,
      total: cart.total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

module.exports = router;