const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = require('./app');
const User = require('./models/User');

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/task_management';

const seedDefaultUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('Seeding default employees...');
      const defaultUsers = [
        { name: 'John Doe', email: 'john@example.com', password: 'Password123!', designation: 'Software Engineer' },
        { name: 'Emma Wilson', email: 'emma@example.com', password: 'Password123!', designation: 'Product Designer' },
        { name: 'Alex Smith', email: 'alex@example.com', password: 'Password123!', designation: 'QA Lead' },
        { name: 'Piyush Yadav', email: 'piyush@example.com', password: 'Password123!', designation: 'Project Manager' },
        { name: 'Rohit Saxena', email: 'rohit@example.com', password: 'Password123!', designation: 'Database Administrator' },
        { name: 'Ananya Joshi', email: 'ananya@example.com', password: 'Password123!', designation: 'Business Analyst' },
        { name: 'Sneha Deshmukh', email: 'sneha@example.com', password: 'Password123!', designation: 'Cane Officer' }
      ];
      await User.create(defaultUsers);
      console.log('Default employees seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding default users:', err.message);
  }
};

mongoose.connect(DB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully.');
    await seedDefaultUsers();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
    process.exit(1);
  });
