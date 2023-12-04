import {Post, postViewModel} from "../../models/post-view-model";
import {ObjectId, SortDirection} from "mongodb";
import {postsPaginationViewModel} from "../../models/pagination-view-models";
import {PostModel} from "../../schemas/post-schema";
import {injectable} from "inversify";
import {PostLikeModel} from "../../schemas/like-schema";
import {likeDetails} from "../../models/like-view-model";

@injectable()
export class PostsQueryRepository {
    async findPosts(
    page: number, limit: number, sortDirection: SortDirection,
    sortBy: string, skip: number, userId: string | false): Promise<postsPaginationViewModel> {

        let allPosts = await PostModel.find(
            {},{})
            .skip(skip)
            .limit(limit)
            .sort( {[sortBy]: sortDirection})
            .lean()

        const total = await PostModel.countDocuments()

        const pagesCount = Math.ceil(total / limit)

       const items = await Promise.all(allPosts.map(async (post) => {
           let likeStatus = "None"
           if (userId) {
               const likeInDB = await PostLikeModel.findOne(
                   {postId: post._id.toString(), userId: userId})
               if (likeInDB) {
                   likeStatus = likeInDB.status
               }
           }

           const newestLikes: likeDetails[] = await PostLikeModel
               .find({ postId: post._id.toString(), status: "Like"},)
               .sort ({addedAt: -1})
               .limit (3)
               .lean()
           return Post.getViewPost({...post, extendedLikesInfo: {
                   ...post.extendedLikesInfo, newestLikes, myStatus: likeStatus
               }})

       }))
        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: total,
            items
        }
    }

    async findPostById(id: string, userId: string | false): Promise<postViewModel | null> {
        const post: Post | null = await PostModel.findOne({_id: new ObjectId(id)}).lean();
        if (!post) {
            return null;
        }

        let myStatus = "None"
        if (userId) {
            const likeInDB = await PostLikeModel.findOne(
                {postId: post._id.toString(), userId: userId})
            if (likeInDB) {
                myStatus = likeInDB.status
            }
        }

        const newestLikes: likeDetails[] = await PostLikeModel
            .find({ postId: post._id.toString(), status: "Like"},)
            .sort ({addedAt: -1})
            .limit (3)
            .lean()

        return Post.getViewPost({...post, extendedLikesInfo:{
            ...post.extendedLikesInfo, newestLikes, myStatus
            }})
    }

    async findPostsByBlogId(blogId: string, page: number, limit: number, sortDirection: SortDirection,
                            sortBy: string, skip: number, userId: string | false) {
        const postsByBlogId = await PostModel.find(
            {blogId: blogId},
            )
            .skip(skip)
            .limit(limit)
            .sort( {[sortBy]: sortDirection})
            .lean()

        const total = await PostModel.countDocuments({blogId: blogId})

        const pagesCount = Math.ceil(total / limit)

        const items = await Promise.all(postsByBlogId.map(async(post) => {
            let likeStatus = "None"
            if (userId) {
                const likeInDB = await PostLikeModel.findOne(
                    {postId: post._id.toString(), userId: userId})
                if (likeInDB) {
                    likeStatus = likeInDB.status
                }
            }

            const newestLikes: likeDetails[] = await PostLikeModel
                .find({ postId: post._id.toString(), status: "Like"},)
                .sort ({addedAt: -1})
                .limit (3)
                .lean()

            return Post.getViewPost({...post, extendedLikesInfo:{
                    ...post.extendedLikesInfo, newestLikes, myStatus: likeStatus
                }})

        }))

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: total,
            items
        }
}
    async updatePostLikes(
        postId: string, likesCount: number, dislikesCount: number) {

        await PostModel.updateOne({_id: new ObjectId(postId)}, {
            $set:
                {
                    "extendedLikesInfo.likesCount": likesCount,
                    "extendedLikesInfo.dislikesCount": dislikesCount,
                }

        });
    }
}