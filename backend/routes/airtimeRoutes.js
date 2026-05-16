const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { buyAirtime } = require('../controllers/airtimeController');

router.post('/buy', auth, buyAirtime);

module.exports = router;
