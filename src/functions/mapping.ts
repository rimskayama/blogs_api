import {Blog} from "../models/blog-view-model";
import {Post} from "../models/post-view-model";
import {User} from "../models/user-view-model";
import {Comment} from "../models/comments-view-model";
import {Device} from "../models/device-model";
import {likeDetails, PostLike} from "../models/like-view-model";

export const blogsMapping = (array: Blog[]) => {
    return array.map((b: Blog) => Blog.getViewBlog(b))
}
export const postsMapping = (array : Post[]) => {
}

export const usersMapping = (array : User[]) => {
    return array.map((u: User) => User.getViewUser(u))
}

export const commentsMapping = (array: Comment[]) => {
    return array.map((c: Comment) => Comment.getViewComment(c))
}

export const devicesMapping = (array: Device[]) => {
    return array.map((d: Device) => Device.getViewDevice(d))
}

export const likeDetailsMapping = (array: likeDetails[]) => {
    return array.map((d: likeDetails) => PostLike.getViewLikeDetails(d))
}

