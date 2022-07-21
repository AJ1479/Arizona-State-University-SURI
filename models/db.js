const mongoose = require('mongoose');

const dotenv = require('dotenv');
mongoose.connect(process.env.MONGO_URL, (err) => {
    if (err) {
        console.log(`Error: ${err}`);
    } else {
        console.log('Mongo Connection Success');
    }
});