const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      wallet: user.wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.fundWallet = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
    }

    const user = await User.findById(req.user.id);
    user.wallet += Number(amount);
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'wallet_fund',
      phone: user.phone,
      amount,
      status: 'successful',
    });

    res.json({
      success: true,
      message: 'Wallet funded successfully',
      balance: user.wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
