const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, address } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = new User({ firstName, lastName, email, password, address });
    await user.save();

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });
  
    const token = jwt.sign(
    { _id: user._id, name: user.firstName, email: user.email }, 'YOUR_SECRET_KEY' );

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

module.exports = { registerUser, loginUser };
