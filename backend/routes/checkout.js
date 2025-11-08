const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

router.post('/', async (req, res) => {
  try {
    const { cartItems, customerInfo } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email) {
      return res.status(400).json({ error: 'Customer information is required' });
    }

    const orderItems = cartItems.map(item => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity
    }));

    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    const order = new Order({
      orderId: uuidv4().slice(0, 8).toUpperCase(),
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email
      },
      items: orderItems,
      total: total,
      timestamp: new Date()
    });

    await order.save();

    const cart = await Cart.findOne({ userId: 'User-123' });
    if (cart) {
      cart.items = [];
      cart.total = 0;
      await cart.save();
    }

    res.json({
      orderId: order.orderId,
      customerInfo: order.customerInfo,
      items: order.items,
      total: order.total,
      timestamp: order.timestamp,
      message: 'Order placed successfully!'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

module.exports = router;