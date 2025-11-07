const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'User-123'
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

cartSchema.pre('save', async function(next) {
  if (this.items.length === 0) {
    this.total = 0;
    return next();
  }

  // Populate products to calculate total
  await this.populate('items.product');
  
  this.total = this.items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);
  
  next();
});


module.exports = mongoose.model('Cart', cartSchema);