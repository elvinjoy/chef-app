const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const Connection = require('./config/config');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const chefRoutes = require('./routes/chefRoutes');
const categoryTagRoutes = require('./routes/categoryTagRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chef', chefRoutes);
app.use('/api/categoryTag', categoryTagRoutes);
app.use('/api/recipe', recipeRoutes);
app.use('/api/comment', commentRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(Connection.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
  res.send('Welcome to E-commerce API');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!', error: err.message });
});

app.listen(Connection.PORT, () => {
  console.log(`Server running on port ${Connection.PORT}`);
});

