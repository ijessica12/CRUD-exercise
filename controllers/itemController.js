const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data.json');

// Read data
const readData = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }

  const data = fs.readFileSync(filePath, 'utf-8');

  return JSON.parse(data);
};

// Write data
const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// GET all items
const getItems = (req, res) => {
  const items = readData();

  res.status(200).json(items);
};

// CREATE item
const createItem = (req, res) => {
  const items = readData();

  const newItem = {
    id: Date.now(),
    name: req.body.name,
    price: Number(req.body.price),
  };

  items.push(newItem);

  writeData(items);

  res.redirect('/items');
};

// UPDATE item
const updateItem = (req, res) => {
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
};

// DELETE item
const deleteItem = (req, res) => {
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
};

// Export controllers
module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
};