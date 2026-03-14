const mongoose = require('mongoose');


connectDB = async () => {
    try {

        const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/notesapp';

        const connectionInstance = await mongoose.connect(URI);
        
        console.log(`\n✅ MongoDB Connected!`);
        console.log(`📡 DB Host: ${connectionInstance.connection.host}`);
        console.log(`📂 DB Name: ${connectionInstance.connection.name}`);
    } catch (error) {
        console.error("❌ MONGODB CONNECTION ERROR: ", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;