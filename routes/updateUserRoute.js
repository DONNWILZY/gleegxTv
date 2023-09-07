const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { updateUser, 
    updatePersonalInfo,
    getUserPrimarySchools,
    addPrimarySchool,
    editPrimarySchool,
    deletePrimarySchool,
    viewHighSchools,
    editHighSchool,
    deleteHighSchool,
    addHighSchool
} = require('../controllers/updateUserController')

const {verifyToken, verifyUser, verifyAdmin, verifyModerator, } = require('../middleWare/authMiddleWare')
//const {validate} = require('../validator/validate') ////registerValidator
//const authValidator = require('../validator/authValidator,js')

router.get('/', (req, res)=>{
    res.send('ALL  THE USER UPDATE HAPPENING HERE. WHAT EVER YOU ARE UPDATING, INCLUDING YOUR LIFE. LOL')
})


////// UPDATE ENTIRE PROFILE
router.put('/allInfo', verifyToken, verifyUser, updateUser);

///// UPDATE PERSONAL INFFORMATION
router.put('/personalInfo', verifyToken, verifyUser, updatePersonalInfo);

////// ADD PRIMRY SCHOOL addPrimarySchool
router.put('/addPrimarySchool/:userId', addPrimarySchool);

///// EDIT PRIMARY SCHOOL editPrimarySchool  
router.put('/editPrimarySchool/:userId/:schoolId', editPrimarySchool);


///// DELTED PRIMARY SCHOOL
router.delete('/deletePrimarySchool/:userId/:schoolId', deletePrimarySchool);

//// GET PRIMARY SCHOOL getUserPrimarySchools
router.get('/primaryschools/:userId', getUserPrimarySchools )


//// view hight schools viewHighSchools
router.get('/viewHighSchools/:userId', viewHighSchools )

///// ADD HICH SCHOOL
router.post('/addHighSchool/:userId', addHighSchool);

/////// EDIT HIGTH SHCOOOK app.put('/api/users/:userId/high-schools/:highSchoolId', editHighSchool);
router.put('/HighSchool/:userId/:schoolId', editHighSchool);







module.exports = router;