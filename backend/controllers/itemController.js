const asyncHandler = require('../middleware/asyncHandler');
const Item = require('../models/Item');

// GET /api/items
exports.getItems = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (q) {
    filter.$or = [
      { name: new RegExp(q, 'i') },
      { sku: new RegExp(q, 'i') },
      { barcode: new RegExp(q, 'i') }
    ];
  }
  const items = await Item.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ name: 1 });
  const total = await Item.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit) });
});

// GET /api/items/:id
exports.getItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  res.json(item);
});

// POST /api/items
exports.createItem = asyncHandler(async (req, res) => {
  const data = req.body;
  const existing = await Item.findOne({ sku: data.sku });
  if (existing) {
    res.status(400);
    throw new Error('Item with same SKU exists');
  }
  const item = await Item.create(data);
  res.status(201).json(item);
});

// PUT /api/items/:id
exports.updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  res.json(item);
});

// DELETE /api/items/:id
exports.deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  res.json({ message: 'Item deleted' });
});
