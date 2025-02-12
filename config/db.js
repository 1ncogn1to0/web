// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        };

        const mongoURI = process.env.DATABASE_URL;
        await mongoose.connect(mongoURI, dbOptions);

        console.log(`✅ MongoDB Connected: ${mongoURI.includes('127.0.0.1') ? 'Local DB' : 'Atlas Cloud'}`);
    } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
