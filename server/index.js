const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes.js');
const productRoutes = require('./routes/productRoutes.js');

const app = express();

mongoose.connect('mongodb://localhost:27017/react_users', {})
.then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));
  
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use('/user/', userRoutes)
app.use('/product/', productRoutes);


app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});


