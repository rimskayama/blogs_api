import mongoose from 'mongoose'
import {blogViewModel} from "../models/blog-view-model";

export const BlogSchema = new mongoose.Schema<blogViewModel>({

    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String, default: Date.now},
    isMembership: { type: Boolean, default:  false},
})
export const BlogModel = mongoose.model<blogViewModel>('blogs', BlogSchema)