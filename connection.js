require('dotenv').config();

const mongoose = require('mongoose');

const connectionStr = "mongodb+srv://ibrahimdarkseid:inayA2520@cluster0.e1n8pqg.mongodb.net/test";

mongoose.connect(connectionStr, {useNewUrlparser: true})
.then(() => console.log('connected to mongodb'))
.catch(err => console.log(err))

mongoose.connection.on('error', err => {
  console.log(err)
})
