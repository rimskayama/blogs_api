import {MongoClient} from "mongodb";
import {blogViewModel} from "../models/blogViewModel";
import {postViewModel} from "../models/postViewModel";
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