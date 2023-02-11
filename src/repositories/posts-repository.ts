import {posts} from "./dataBase/posts-DB";
import {postsType} from "./dataBase/posts-DB";
import {randomNumber} from "./randomNumber";

export const postsRepository = {
    findPosts(name: string) {
        if (name) {
            let allPosts= posts.filter(b => b.title.indexOf(name) > -1)
            return allPosts;
        } else return posts
    },
    findPostById(id: string) {
        return posts.find(b => b.id === id);
    },
    createPost(title: string, shortDescription: string, content: string, blogId: string, blogName: string) {
        const newPost : postsType = {
            id: randomNumber(0,999999),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogName
        }
        posts.push(newPost);
        return newPost
    },
    updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        let updatedPost = posts.find(p => p.id === id);
        if (updatedPost) {
            updatedPost.title = title;
            updatedPost.shortDescription = shortDescription;
            updatedPost.content = content;
            updatedPost.blogId = blogId

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


