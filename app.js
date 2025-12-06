require('dotenv').config();
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

//Registering the user
app.post("/register", async(req, res) => {
    const { email, password } = req.body;    
    try {
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).json(newUser);
        res.sendFile(__dirname + '/./views/registrationSuccess.html');
    } catch (error) {
        res.status(500).json({message: "Server error"});
        res.sendFile(__dirname + '/./views/404.html');
    }
});

//User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }); 
    if (user != null && user.password === password){
        console.log("Login successful");
        res.status(200).json({messate: "Login successful", email}).sendFile(__dirname + '/./views/registrationSuccess.html');
        //res.sendFile(__dirname + '/./views/registrationSuccess.html');
    }else{
        res.status(401).json({message: "Invalid email or password"}).sendFile(__dirname + '/./views/404.html');
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