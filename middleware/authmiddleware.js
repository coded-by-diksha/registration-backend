const express=require('express');

const app=express();

// to check if the user is authenticated
const requireauth = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

// to check if the user is already logged in    
const checkauth = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/dashboard');
    }
    next();
};



module.exports = {
    requireauth,
    checkauth
};
