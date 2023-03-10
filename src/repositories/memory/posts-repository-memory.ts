import {postViewModel, postViewModelWithId} from "../../models/postViewModel";
import {randomNumber} from "../../functions/randomNumber";

const posts : postViewModelWithId[] = []
export const postsRepository = {
    findPosts(name: string) {
        if (name) {
            let allPosts= posts.filter(b => b.title.indexOf(name) > -1)
            return allPosts;
        } else return posts
    },
    findPostById(id: string) {
        if (id) {
            return posts.find(b => b.id === id);
        } else {
            return posts;
        }

    },
    createPost(title: string, shortDescription: string, content: string, blogId: string, blogName: string) {
        const newPost : postViewModelWithId = {
            id: randomNumber(0,999999),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogName,
            createdAt: (new Date()).toISOString(),
        }
        posts.push(newPost);
        return newPost
    },
    updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string) {
        let updatedPost = posts.find(p => p.id === id);
        if (updatedPost) {
            updatedPost.title = title;
            updatedPost.shortDescription = shortDescription;
            updatedPost.content = content;
            updatedPost.blogId = blogId;
            updatedPost.blogName = blogName

        }
        return updatedPost
    },
    deletePost(id: string) {
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === id) {
                posts.splice(i, 1);
                return true;
            }
        }
        return false
    }

}


