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



app.use(cors());
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies, receve data form body.
app.use(express.json()); // Middleware to parse JSON bodies


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/./views/index.html');
});

//Registering the user
app.post("/register", (req, res) => {
    const { email, password } = req.body;    
    res.status(201).json({email,password});
});

//User login
app.post('/login', (req, res) => {
    const { email, password } = req.body;    
    res.status(200).json({messate: "Login successful", email});
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