const express = require('express');
const app = express();
require('dotenv').config();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const listingRoutes = require('./routes/listing');
const reviewRoutes = require('./routes/review');

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(process.env.MONGO_URL).then(() => console.log('MongoDB is connected..'))
    .catch((error) => console.log(error));


app.use('/api/v1/users', userRoutes);
app.use('/api/v1/listing', listingRoutes);
app.use('/api/v1/review', reviewRoutes);
app.listen(PORT, () => {
    console.log(`Server is listen on port: http://localhost:${PORT}`);
})