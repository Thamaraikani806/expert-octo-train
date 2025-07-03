const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db.js');

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, address } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (firstName, lastName, email, password, address) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, address]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
 
module.exports ={ registerUser, loginUser };