const express = require('express');
const path = require('path');  
const bcrypt = require('bcrypt');
const collection = require('./config');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/home', (req, res) => {
    
    const seatData = {
        seatNumber: 1,
        seatType: 'Window',
        isOccupied: false,
        passengerName: null,
        
    };
    res.render('home', { seatData });
});

app.get('/seat', (req, res) => {
    
    const seatData = {
        seatNumber: req.query.seatNumber,
        seatType: req.query.seatType,
        
    };

    
    res.render('seat', { seatData });
});

app.get('/pay', (req, res) => {
    res.render('pay');
});

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password,
    };
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;
        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }
});


app.post("/booknow", (req, res) => {
    
    const seatData = {
        seatNumber: req.body.seatNumber,
        seatType: req.body.seatType
        
    };

    
    res.render("seat", { seatData });
});

app.post("/pay", (req, res) => {
    
    const seatData = {
        seatNumber: req.body.seatNumber,
        seatType: req.body.seatType
        
    };

    
    res.render("pay", { seatData });
});



app.post('/login', async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send('User name not found');
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            res.render('home');
        } else {
            res.send('Wrong password');
        }
    } catch {
        res.send('Wrong details');
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
