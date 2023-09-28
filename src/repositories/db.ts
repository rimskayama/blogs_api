import {MongoClient} from "mongodb";
import {blogViewModel} from "../models/blog-view-model";
import {postViewModel} from "../models/post-view-model";
import {APIsModel, userInputModel} from "../models/user-view-model";
import {commentModelWithMongoId} from "../models/comments-view-model";
import {deviceViewModel} from "../models/device-model";
import dotenv from 'dotenv';

dotenv.config()

const mongoURI = process.env.MONGO_URL
if (!mongoURI) {
    throw new Error('URL was not found')
}

export const client = new MongoClient(mongoURI);

const db = client.db();
export const blogsCollection = db.collection<blogViewModel>("blogs")
export const postsCollection = db.collection<postViewModel>("posts")
export const usersCollection = db.collection<userInputModel>("users")
export const commentsCollection = db.collection<commentModelWithMongoId>("comments")
export const devicesCollection = db.collection<deviceViewModel>("devices")
export const APIsCollection = db.collection<APIsModel>("APIs")

export async function runDB() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verity connection
        await client.db().command({ ping: 1});
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Can't connect to DB")
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}