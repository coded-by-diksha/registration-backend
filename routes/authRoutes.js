const express = require('express');
const {body}=require('express-validator');
const authController=require('../controllers/auth.js');
const {requireauth, checkauth}=require('../middleware/authmiddleware.js');

const router = express.Router();

// Registration routes

const registerValidation=[
    body('username').isLength({min: 3}).withMessage('Username must be at least 3 characters long').trim(),
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long').trim(),
];

const loginValidation=[
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long').trim(),
];

router.get('/register', checkauth, authController.getRegister);
router.post('/register', registerValidation, authController.postRegister);



router.get('/login', checkauth, authController.getLogin);
router.post('/login', loginValidation, authController.postLogin);


router.get('/dashboard', requireauth, authController.getDashboard);

router.post('/logout', requireauth, authController.postLogout);

module.exports=router;