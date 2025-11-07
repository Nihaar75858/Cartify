const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Cartify', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Connection error:', err));

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Cartify API',
    endpoints: {
      products: 'GET /api/products',
      cart: 'GET /api/cart',
      addToCart: 'POST /api/cart',
      updateCart: 'PUT /api/cart/:id',
      removeFromCart: 'DELETE /api/cart/:id',
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
