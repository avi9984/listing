const express = require('express');
const router = express.Router();
const { register, login, logOut, updateProfile, userDetails } = require('../controllers/user');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logOut);
router.put('/updateProfile', updateProfile);
router.get('/userDetails', userDetails);


module.exports = router;