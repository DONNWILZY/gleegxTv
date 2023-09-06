const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {verifyToken, verifyUser, verifyAdmin, verifyModerator, } = require('../middleWare/authMiddleWare')


router.get('/', (req, res)=>{
    res.send('USER ROUTE GOING THROUGH')
})

////// ADMIN TO ADD USERS addAdminUser
router.post('/createUser/:adminId', verifyToken, verifyAdmin, adminController.addUserByAdmin)






module.exports = router;