
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');

const Users = require('../models/Users');

exports.getRegister=(req, res, next)=>{
    res.render('register', {
        title: 'Register',
       errors: [],
        oldInput: {
           
        },
    });
    
    

};




exports.postRegister = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('register', {
                title: 'Register',
                errors: errors.array(),
                oldInput: req.body
            });
        }

        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = Users.createUser({
            username,
            email,
            password: hashedPassword
        });

        req.session.userId = user.id;
        req.session.username = user.username;
        res.redirect('/dashboard');

    } catch (err) {
        console.error(err);
        res.status(500).render('register', {
            title: 'Register',
            errors: [{ msg: 'Internal server error' }],
            oldInput: req.body
        });
    }
};


exports.getLogin=(req, res, next)=>{
    res.render('login', {
        title: 'Login',
        errors: [],
        oldInput: {}
    });
};



exports.postLogin= async (req, res, next)=>{
    try{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('login', {
            title: 'Login',
            errors: errors.array(),
            oldInput: req.body
        });
    }   
    const {email, password}= req.body;
    // Find user by email
    const user=  Users.findByEmail(email);
    if(!user){
        return res.status(401).render('login', {
            title: 'Login',
            errors: [{msg: 'Invalid email or password'}],
            oldInput: req.body
        });
    }
    const isMatch= await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(401).render('login', {
            title: 'Login',
            errors: [{msg: 'Invalid email or password'}],
            oldInput: req.body
        });
    }
    req.session.userId=user.id;
    req.session.username=user.username;
    res.redirect('/dashboard');
} catch (err) {
    console.error(err);
    res.status(500).render('login', {
        title: 'Login',
        errors: [{msg: 'Internal server error'}],
        oldInput: req.body
    });
}


};



exports.postLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).redirect('/dashboard');
        }
        res.redirect('/login');
    });
};


exports.getDashboard=(req, res, next)=>{
    if(!req.session.userId){
        return res.redirect('/login');
    }
    res.render('dashboard', {
        title: 'Dashboard',
        username: req.session.username
    });
};
