const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  id: { type: Number, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  description: { type: String, required: true, minlength: 3, maxlength: 100 },
  price: { type: String, required: true, min: [0, 'Price cannot be negative'] },
  brand: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
  timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' }
});

module.exports = mongoose.model('Product', productSchema);
