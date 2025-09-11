const express=require('express');
const session=require('express-session');
const path=require('path');
const authRoutes=require('./routes/authRoutes.js');

const app=express();

/** Set EJS as the view engine for rendering templates */
app.set('view engine', 'ejs');
/** Set the directory for EJS views */
app.set('views', path.join(__dirname, 'views'));

/** Middleware to parse URL-encoded bodies */
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

/** Configure session management */
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: true, maxAge: 600000} // Session expires after 10 minutes
}));

// adding routes
app.use(authRoutes);

// starting the server
app.get('/', (req, res)=>{
    res.send('Welcome to the Home Page');
    res.redirect('/dashboard');

});

const PORT= process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});