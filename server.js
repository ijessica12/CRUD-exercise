const express = require('express');
const itemRoutes = require('./routes/itemRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home page
app.get('/', (req, res) => {
  res.send(`
    <h1>CRUD APP</h1>

    <form action="/items" method="POST">
      <input 
        type="text" 
        name="name" 
        placeholder="Enter item name"
        required
      />

      <br /><br />

      <input 
        type="number" 
        name="price" 
        placeholder="Enter item price"
        required
      />

      <br /><br />

      <button type="submit">
        Add Item
      </button>
    </form>

    <br />

    <a href="/items">View All Items</a>
  `);
});

// Use routes
app.use(itemRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});