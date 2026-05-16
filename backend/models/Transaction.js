const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['data', 'airtime', 'wallet_fund', 'electricity', 'cable'],
      required: true,
    },
    network: {
      type: String,
      enum: ['MTN', 'Airtel', 'Glo', '9mobile', 'Smile', 'Spectranet'],
    },
    phone: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'successful', 'failed'],
      default: 'pending',
    },
    reference: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
