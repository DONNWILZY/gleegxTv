const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose  = require('mongoose');
const http = require('http');
dotenv.config();
const PORT = process.env.PORT || 5000

app.use(express.json());

// Import routes

const authRoute = require('./routes/authRoute',);
const updateUserRoute = require('./routes/updateUserRoute');
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');


// Routes middlewares
app.use('/api/auth', authRoute);
app.use('/api/updateUser', updateUserRoute);
app.use('/api/user', updateUserRoute);
app.use('/api/admin', adminRoute);



////// URL FOR THE PROJECT
const prodUrl = `http://127.0.0.1:${PORT}` ;
const liveUrl =  `${process.env.currentUrl}:${PORT}`
const currentUrl = liveUrl ||  prodUrl  ;

//// DATABSE URL local: process.env.MONGODB_URI ||| cloud:process.env.databaseUrl 
const dbUrl =  /*process.env.databaseUrl || */ process.env.MONGODB_URI;


// Database connection
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
/// db connection error
db.on('error', (error) => {
  console.error('Connection error:', error);
});
//// db connecrion status.Successful alert
db.once('open', () => {
  console.log('Connection to MongoDB successful!');
});
//// db connecrion status.failure  alert
db.once('close', () => {
  console.log('Connection to MongoDB disconnected.');
});


app.get('/', (req, res) => {
  res.send('Hello, world!');
});


app.listen(3000, () => {
  console.log('Server started on port 3000');
});