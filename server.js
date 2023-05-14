const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const fs = require('fs');
const { Stripe } = require('stripe');
const stripe = new Stripe('sk_test_51N7DVKSJofQOAmXRyvIkzKHhfOdrTzkVYPKrp4hQkNhx6l4Pu1Lzh0880tEKCcviDDnzw5fDc52332K84p4vPJeR00ZXT58Ijj');

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
    origin: '*',
    methods: "*",
  },
});

app.use(cors());

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
    description:"amxon",
  
      currency: 'inr',
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

