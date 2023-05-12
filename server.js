const express = require('express');
const cors = require('cors');
const app = express();
const https = require('https');
const fs = require('fs');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { Server } = require('socket.io');
const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const imageRoutes = require('./routes/imageRoutes');



const server = https.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://ecommerce7-w4hj.onrender.com',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

app.use(cors());

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/images', imageRoutes);

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

server.listen(8080, () => {
  console.log('server running at port', 8080);
});

app.set('socketio', io);
