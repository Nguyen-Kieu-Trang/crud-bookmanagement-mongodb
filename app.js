// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// Create Express app
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb+srv://it4409:it4409-soict@lamdb-crud.qd3s7vv.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define blog schema
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Blog = mongoose.model('Blog', blogSchema);

// Routes

// List all blogs
app.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.render('index', { blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Render form for adding a new blog
app.get('/blogs/new', (req, res) => {
  res.render('new');
});

// Create a new blog
app.post('/blogs', async (req, res) => {
  const { title, content } = req.body;
  try {
    await Blog.create({ title, content });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Render form for editing a blog
app.get('/blogs/:id/edit', async (req, res) => {
    const { id } = req.params;
    try {
      const blog = await Blog.findById(id);
      res.render('edit', { blog });
    } catch (error) {
      console.error('Error fetching blog:', error);
      res.status(500).send('Internal Server Error');
    }
});

// Update a blog
app.put('/blogs/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
      await Blog.findByIdAndUpdate(id, { title, content });
      res.redirect('/');
    } catch (error) {
      console.error('Error updating blog:', error);
      res.status(500).send('Internal Server Error');
    }
  });

// Delete a blog
app.delete('/blogs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Blog.findByIdAndDelete(id);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server started on port', port);
});
