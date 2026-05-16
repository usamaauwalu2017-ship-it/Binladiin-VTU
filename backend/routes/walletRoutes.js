const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { fundWallet, getWallet, getTransactions } = require('../controllers/walletController');

router.get('/balance', auth, getWallet);
router.post('/fund', auth, fundWallet);
router.get('/transactions', auth, getTransactions);

module.exports = router;
