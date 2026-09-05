const express = require('express');
const path = require('path');
const User = require('./models/User');
const Task = require('./models/Task');

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API: Register User
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, designation } = req.body;

    if (!name || !email || !password || !designation) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password, // Plain text password (simple backend)
      designation
    });

    res.status(201).json({
      status: 'success',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        designation: user.designation
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API: Login User
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      status: 'success',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        designation: user.designation
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API: Fetch employees/users list
app.get('/api/employees', async (req, res) => {
  try {
    const users = await User.find({}).select('name designation email').sort('name');
    res.status(200).json({
      status: 'success',
      data: users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API: Create Task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, assignedTo, assignedBy, dueDate } = req.body;

    if (!title || !assignedTo || !dueDate || !assignedBy) {
      return res.status(400).json({ message: 'Title, assignedTo, assignedBy, and dueDate are required' });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy,
      dueDate
    });

    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name designation');

    res.status(201).json({
      status: 'success',
      data: populatedTask
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API: Fetch all Tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name designation')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: tasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API: Update Task Status
app.patch('/api/tasks/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({
      status: 'success',
      data: task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API: Fetch stats
app.get('/api/tasks/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const totalThisMonth = await Task.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const completed = await Task.countDocuments({ status: 'Completed' });
    const pending = await Task.countDocuments({ status: 'Pending' });

    res.status(200).json({
      status: 'success',
      data: {
        totalThisMonth,
        completed,
        pending
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve static files from client folder
app.use(express.static(path.join(__dirname, '../client')));

// Redirect default route to dashboard.html (which will redirect to login if not logged in)
app.get('/', (req, res) => {
  res.redirect('/views/dashboard.html');
});

module.exports = app;
