require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express(); 
const cors = require('cors');
const PORT = process.env.PORT || 5000;


const db_uri = process.env.MONGO_URI;
const mongoose = require('mongoose');

mongoose.connect(db_uri).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});
const User = require('./models/user.model');


app.use(cors());
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies, receve data form body.
app.use(express.json()); // Middleware to parse JSON bodies


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/./views/index.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/./views/registrationForm.html');
});
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/./views/loginForm.html');
});
app.get('/registrationSuccess', (req, res) => {
    res.sendFile(__dirname + '/./views/registrationSuccess.html');
});

//Registering the user
app.post("/register", async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }); 
    if (user){
        return  res.status(400).json({message: "User already exists"});
    }
    try {
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).json({
            message: "User registered successfully",
            email: newUser.email,
            password: newUser.password,
            token: jwt.sign(
                {email: newUser.email}, 
                process.env.JWT_SECRET, 
                {expiresIn: '1h'}
            )
        });
    } catch (error) {
        res.status(500).json({message: "Server error"});
        // res.status(500).sendFile(__dirname + '/./views/404.html');
    }
});

//User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }); 
    if (user != null && user.password === password){
        console.log("Login successful");
        res.status(200).json({
            messate: "Login successful", 
            email: user.email,
            password: user.password,
            token: jwt.sign(
                {email: user.email}, 
                process.env.JWT_SECRET, 
                {expiresIn: '1h'}
            )
        });
    }else{
        res.status(401).json({message: "Invalid email or password"});
    }    
});


//Routes not found
app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + '/./views/404.html');
});

//Handling server error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on  http://localhost:${PORT}`);
});