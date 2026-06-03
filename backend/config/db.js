const mongoose = require('mongoose');

const connectDB = async () => {
    if (process.env.NODE_ENV === 'test') {
        console.log('MongoDB connection skipped for tests');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cropchain', {
             serverSelectionTimeoutMS: 2000 // Fast timeout to quickly fallback
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn('⚠️ Local MongoDB connection failed. Starting in-memory MongoDB server instead...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            await mongoose.connect(mongoUri);
            console.log(`✅ In-Memory MongoDB Connected at: ${mongoUri}`);
        } catch (memError) {
            console.error(`❌ In-Memory MongoDB Error: ${memError.message}`);
        }
    }
};

module.exports = connectDB;
