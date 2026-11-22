const express = require('express');
const auth = require('../middleware/authMiddleware');
const { getMyProfile, updateMyProfile, getPublicProfile } = require('../controllers/therapistController');

const router = express.Router();

router.get('/me', auth, getMyProfile);
router.put('/me', auth, updateMyProfile);
router.get('/:slug', getPublicProfile); // must stay LAST

module.exports = router;