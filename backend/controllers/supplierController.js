const Supplier = require('../models/Supplier');
const asyncHandler = require('../middleware/asyncHandler');

exports.getSuppliers = asyncHandler(async (req, res) => {
  const { q, page=1, limit=50 } = req.query;
  const filter = {};
  if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { contactName: new RegExp(q, 'i') }];
  const suppliers = await Supplier.find(filter).skip((page-1)*limit).limit(Number(limit));
  const total = await Supplier.countDocuments(filter);
  res.json({ suppliers, total });
});

exports.createSupplier = asyncHandler(async (req,res) => {
  const supplier = await Supplier.create(req.body);
  res.status(201).json(supplier);
});

exports.updateSupplier = asyncHandler(async (req,res) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!supplier) { res.status(404); throw new Error('Supplier not found'); }
  res.json(supplier);
});

exports.deleteSupplier = asyncHandler(async (req,res) => {
  const supplier = await Supplier.findByIdAndDelete(req.params.id);
  if (!supplier) { res.status(404); throw new Error('Supplier not found'); }
  res.json({ message: 'Supplier deleted' });
});
