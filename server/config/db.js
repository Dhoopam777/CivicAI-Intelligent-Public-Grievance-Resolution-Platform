import mongoose from "mongoose";

// Function to connect to the mongodb database
export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("❌ MONGO_URI is missing. Please check your .env file!");
            return;
        }

        mongoose.connection.on('connected', () => console.log('✅ Database Connected Successfully!'));
        mongoose.connection.on('error', (err) => console.log('❌ Database Error:', err));

        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.log("❌ Failed to connect to MongoDB:", error.message);
    }
}