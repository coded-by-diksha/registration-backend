const express = require('express');
const {body, check}=require('express-validator');
const authController=require('../controllers/auth.js');
const {requireauth, checkauth}=require('../middleware/authmiddleware.js');

const router = express.Router();

// Registration routes

const registerValidation=[
    body('username').isLength({min: 3}).withMessage('Username must be at least 3 characters long').trim(),
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long').trim(),
];

const loginValidation = [
    body('emailOrUsername')
        .custom(value => {
            // Allow either a valid email or a username (min 3 chars)
            const isEmail = /\S+@\S+\.\S+/.test(value);
            if (isEmail || value.length >= 3) {
                return true;
            }
            throw new Error('Please enter a valid email or username');
        }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').trim(),
];

router.get('/register', checkauth, authController.getRegister);
router.post('/register', registerValidation, authController.postRegister);



router.get('/login', checkauth, authController.getLogin);
router.post('/login', loginValidation, authController.postLogin);


router.get('/dashboard', requireauth, authController.getDashboard);

router.post('/logout', requireauth, authController.postLogout);

module.exports=router;