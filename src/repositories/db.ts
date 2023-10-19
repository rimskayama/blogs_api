import {MongoClient} from "mongodb";
import {postViewModel} from "../models/post-view-model";
import {APIsModel, userInputModel} from "../models/user-view-model";
import {commentModelWithMongoId} from "../models/comments-view-model";
import {deviceInputModel} from "../models/device-model";
import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config()

const dbName = 'blogs_api'
const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`

if (!mongoURI) {
    throw new Error('URL was not found')
}

export const client = new MongoClient(mongoURI);

const db = client.db();
export const usersCollection = db.collection<userInputModel>("users")
export const commentsCollection = db.collection<commentModelWithMongoId>("comments")
export const devicesCollection = db.collection<deviceInputModel>("devices")
export const APIsCollection = db.collection<APIsModel>("APIs")

export async function runDB() {
    try {
        // Connect the client to the server
        await client.connect();
        await mongoose.connect(mongoURI)
        // Establish and verity connection
        console.log("Connected successfully");
    } catch {
        console.log("Can't connect to DB")
        await client.close();
        await mongoose.disconnect()
    }
}