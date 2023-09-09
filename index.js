const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
app.use(cors());
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
const ConnectRoute = require('./routes/connectRoute');
const blogRoute = require('./routes/blogRoute');
const anonyStory = require('./routes/anonymousStoryRoute');
const chatRoute = require('./routes/chatRoute');
const anonyMessage = require('./routes/anonymousMessage');
const storyRoute = require('./routes/storiesRoute');
const meetSomeOne = require('./routes/meetSomeOneRoute');
const blindDateRoute = require('./routes/blindDateRoute');
const contentRoute = require('./routes/contentRoute');
const pollRoute = require('./routes/pollRoute');
const supportRoute = require('./routes/supportRoute');
const pitchDeckRoute = require('./routes/pitchDeckRoute');
const awardRoute = require('./routes/awardRoute');
const adsRoute = require('./routes/adsRoute');
const businessPageRoute = require('./routes/businessPage');
const paymentRoute = require('./routes/paymentRoute');
const subscriptionRoute = require('./routes/subscriptionRoute');




// Routes middlewares
app.use('/api/auth', authRoute);
app.use('/api/updateUser', updateUserRoute);
app.use('/api/user', updateUserRoute);
app.use('/api/admin', adminRoute);
app.use('/api/connect', ConnectRoute);
app.use('/api/blog', blogRoute);
app.use('/api/annystories', anonyStory);
app.use('/api/chat', chatRoute);
app.use('/api/anonymous', anonyMessage);
app.use('/api/stories', storyRoute);
app.use('/api/meetpeople', meetSomeOne);
app.use('/api/blinddate', blindDateRoute);
app.use('/api/content', contentRoute);
app.use('/api/poll', pollRoute);
app.use('/api/support', supportRoute);
app.use('/api/pitchdeck', pitchDeckRoute);
app.use('/api/award', awardRoute);
app.use('/api/advert', adsRoute);
app.use('/api/business', businessPageRoute);
app.use('/api/payment', paymentRoute); 
app.use('/api/subscrition', subscriptionRoute); 




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


app.listen(5000, () => {
  console.log('Server started on port 3000');
});