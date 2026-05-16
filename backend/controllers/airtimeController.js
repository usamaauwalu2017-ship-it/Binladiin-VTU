const axios = require('axios');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.buyAirtime = async (req, res) => {
  try {
    const { network, phone, amount } = req.body;

    if (!network || !phone || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const user = await User.findById(req.user.id);

    if (user.wallet < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance',
      });
    }

    try {
      const response = await axios.post(
        `${process.env.VTU_API_URL}/airtime`,
        {
          network,
          mobile_number: phone,
          amount,
        },
        {
          headers: {
            Authorization: `Token ${process.env.VTU_API_KEY}`,
          },
        }
      );

      user.wallet -= amount;
      await user.save();

      await Transaction.create({
        userId: user._id,
        type: 'airtime',
        network,
        phone,
        amount,
        status: 'successful',
        reference: response.data?.reference,
      });

      res.json({
        success: true,
        message: 'Airtime purchase successful',
        data: response.data,
        wallet: user.wallet,
      });
    } catch (apiError) {
      await Transaction.create({
        userId: user._id,
        type: 'airtime',
        network,
        phone,
        amount,
        status: 'failed',
      });

      res.status(400).json({
        success: false,
        message: 'Airtime purchase failed. Please try again.',
        error: apiError.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
