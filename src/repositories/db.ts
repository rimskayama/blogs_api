import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config()

const dbName = 'blogs_api'
const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`

if (!mongoURI) {
    throw new Error('URL was not found')
}

export async function runDB() {
    try {
        // Connect the client to the server
        await mongoose.connect(mongoURI)
        // Establish and verity connection
        console.log("Connected successfully");
    } catch {
        console.log("Can't connect to DB")
        await mongoose.disconnect()
    }
}