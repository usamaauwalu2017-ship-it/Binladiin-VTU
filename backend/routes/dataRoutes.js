const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { buyData, getDataPlans } = require('../controllers/dataController');

router.post('/buy', auth, buyData);
router.get('/plans', auth, getDataPlans);

module.exports = router;
