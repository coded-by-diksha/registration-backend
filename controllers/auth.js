
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
        const user = await Users.create({
            username,
            email,
            password: hashedPassword,
            status: true
        });
        console.log(user);
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

    console.log('Login page rendered');
};




exports.postLogin = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        console.log(errors);

        if (!errors.isEmpty()) {
            return res.status(422).render('login', {
                title: 'Login',
                errors: errors.array(),
                oldInput: req.body
            });
        }

        const { emailOrUsername, password } = req.body;
        let user = await Users.findByEmail(emailOrUsername);

        // If user not found by email, try by username
        if (!user) {
            user = await Users.findByUsername(emailOrUsername);
        }

        if (!user) {
            return res.status(401).render('login', {
                title: 'Login',
                errors: [{ msg: 'Invalid email or password' }],
                oldInput: req.body
            });
        }

        if (!user.status) {
            return res.status(401).render('login', {
                title: 'Login',
                errors: [{ msg: 'Account is inactive. Please contact support.' }],
                oldInput: req.body
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).render('login', {
                title: 'Login',
                errors: [{ msg: 'Invalid email or password' }],
                oldInput: req.body
            });
        }

        // Successful login
        req.session.userId = user.id;
        req.session.username = user.username;
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).render('login', {
            title: 'Login',
            errors: [{ msg: 'Internal server error' }],
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



exports.getDashboard = async (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    try {
        // Count active users (status: true)
        const users = await Users.getAllUsers();
        const activeUsers = users.filter(ur => ur.status === true).length;
        res.render('dashboard', {
            title: 'Dashboard',
            username: req.session.username,
            activeUsers
        });
    } catch (err) {
        console.error(err);
        res.render('dashboard', {
            title: 'Dashboard',
            username: req.session.username,
            activeUsers: 0
        });
    }
};
