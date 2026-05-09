const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
const filePath = path.join(__dirname, 'data.json');

const readData = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

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

app.get('/items', (req, res) => {
  const items = readData();

  res.status(200).json(items);
});

app.post('/items', (req, res) => {
  const items = readData();

  const newItem = {
    id: Date.now(),
    name: req.body.name,
    price: Number(req.body.price)
  };

  items.push(newItem);

  writeData(items);

  res.status(201).redirect('/items');
});

app.put('/items/:id', (req, res) => {
  const items = readData();

  const id = Number(req.params.id);

  const itemIndex = items.findIndex(
    (item) => item.id === id
  );

  if (itemIndex === -1) {
    return res.status(404).json({
      message: 'Item not found',
    });
  }

  items[itemIndex] = {
    ...items[itemIndex],
    ...req.body,
  };

  writeData(items);

  res.status(200).json({
    message: 'Item updated successfully',
    item: items[itemIndex],
  });
});

app.delete('/items/:id', (req, res) => {
  const items = readData();

  const id = Number(req.params.id);

  const filteredItems = items.filter(
    (item) => item.id !== id
  );

  if (items.length === filteredItems.length) {
    return res.status(404).json({
      message: 'Item not found',
    });
  }

  writeData(filteredItems);

  res.status(200).json({
    message: 'Item deleted successfully',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});