import mongoose from "mongoose";

// Подключение к базе данных MongoDB
export const connectDB = async (mongodb) => {
    try {
        const conn = await mongoose.connect(mongodb)
        console.log(`MongoDB connect: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error connect MongoDB: ${error.message}`)
    }
}