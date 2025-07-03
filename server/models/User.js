const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

  firstName: { type: String, required: true,  min:3, max:30 },
  lastName: { type: String, required: true, min:3, max:30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, min:6, max:20 },
  address: { type: String },
});



userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);


