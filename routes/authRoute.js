const express = require('express');
const router = express.Router();
//const validateFileds = require('../validator/validate');
const {registerUser, loginUser} = require('../controllers/authController');

router.get('/', (req, res)=>{
    res.send(' running here');
}
)

// User registration route
router.post('/register', registerUser);
router.post('/login', loginUser);




module.exports = router;