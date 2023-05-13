const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const fs = require('fs');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { Server } = require('socket.io');
const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const imageRoutes = require('./routes/imageRoutes');
const mongoose=require("mongoose");

const connectionStr = "mongodb+srv://ibrahimdarkseid:inayA2520@cluster0.e1n8pqg.mongodb.net/test";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://ec7.onrender.com',

  },
});
const allowedOrigins = ['https://ec7.onrender.com'];

// Enable CORS with the allowed origins
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin is allowed
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  }
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/images', imageRoutes);
mongoose.connect(connectionStr, {useNewUrlparser: true})
.then(() => console.log('connected to mongodb'))
.catch(err => console.log(err))

mongoose.connection.on('error', err => {
  console.log(err)
})
app.post('/create-payment', async(req, res)=> {
  const {amount} = req.body;
  console.log(amount);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card']
    });
    res.status(200).json(paymentIntent)
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.message);
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(4000, () => {
  console.log('server running at port', 4000);
});



app.set('socketio', io);

