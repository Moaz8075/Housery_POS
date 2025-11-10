const Customer = require('../models/Customer');
const asyncHandler = require('../middleware/asyncHandler');

exports.getCustomers = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { phone: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];
  const customers = await Customer.find(filter).skip((page - 1) * limit).limit(Number(limit));
  const total = await Customer.countDocuments(filter);
  res.json({ customers, total, page: Number(page) });
});

exports.getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) { res.status(404); throw new Error('Customer not found'); }
  res.json(customer);
});

exports.createCustomer = asyncHandler(async (req, res) => {
  const data = req.body;
  const customer = await Customer.create(data);
  res.status(201).json(customer);
});

exports.updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!customer) { res.status(404); throw new Error('Customer not found'); }
  res.json(customer);
});

exports.deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) { res.status(404); throw new Error('Customer not found'); }
  res.json({ message: 'Customer removed' });
});
