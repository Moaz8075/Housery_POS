const Sale = require('../models/Sale');
const Payment = require('../models/Payment');
const asyncHandler = require('../middleware/asyncHandler');

exports.getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find().populate('sale').sort({ createdAt: -1 });
  res.json({ payments });
});

exports.createPayment = asyncHandler(async (req, res) => {
  const { sale: saleId, amount, method, reference, receivedBy } = req.body;
  if (!amount) { res.status(400); throw new Error('Amount is required'); }

  const payment = await Payment.create({ sale: saleId, amount, method, reference, receivedBy });

  // update sale's paid amount if sale provided
  if (saleId) {
    const sale = await Sale.findById(saleId);
    if (sale) {
      sale.paidAmount = (sale.paidAmount || 0) + amount;
      await sale.save();
    }
  }

  res.status(201).json(payment);
});

exports.getPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) { res.status(404); throw new Error('Payment not found'); }
  res.json(payment);
});

exports.deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment) { res.status(404); throw new Error('Payment not found'); }
  res.json({ message: 'Payment deleted' });
});
