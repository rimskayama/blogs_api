import {Request, Response, Router} from 'express'
import {blogsRepository} from "../repositories/mongodb/blogs-repository-mongodb";
import {errorsValidationMiddleware} from "../middlewares/errorsValidationMiddleware";
import {
    blogDescriptionValidationMiddleware,
    blogNameValidationMiddleware, blogWebsiteUrlValidationMiddleware
} from "../middlewares/blogsBodyValidationMiddleware";
import {basicAuthMiddleware} from "../middlewares/basicAuth";
import {ObjectId} from "mongodb";
import {membershipValidationMiddleware} from "../middlewares/blogsBodyValidationMiddleware";


export const blogsRouter = Router({})

//GET ALL
blogsRouter.get("/", async (req: Request, res: Response) => {
    const allBlogs = await blogsRepository.findBlogs()
    res.status(200).json(allBlogs)
})


//GET WITH URI
blogsRouter.get("/:id", async (req: Request, res: Response) => {
    let blog = await blogsRepository.findBlogById(
        new ObjectId(req.params.id))
    if (blog) {
        res.json(blog);
    } else res.sendStatus(404)
})

//POST
blogsRouter.post("/",
    basicAuthMiddleware,
    blogNameValidationMiddleware,
    blogDescriptionValidationMiddleware,
    blogWebsiteUrlValidationMiddleware,
    membershipValidationMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const newBlog = await blogsRepository.createBlog(new ObjectId(req.params.id), req.body.name,
            req.body.description, req.body.websiteUrl, req.body.isMembership);
        console.log('new', newBlog)
        res.status(201).json(newBlog)
})

//PUT
blogsRouter.put("/:id",
    basicAuthMiddleware,
    blogNameValidationMiddleware,
    blogDescriptionValidationMiddleware,
    blogWebsiteUrlValidationMiddleware,
    membershipValidationMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
    const updatedBlog = await blogsRepository.updateBlog(
        new ObjectId(req.params.id), req.body.name, req.body.description,
        req.body.websiteUrl, req.body.isMembership
    )
    if (updatedBlog) {
        res.sendStatus(204);
    } else {
        res.status(404).send('Not Found');
    }

})

//DELETE
blogsRouter.delete("/:id",
    basicAuthMiddleware,
    async (req: Request, res: Response) => {
    const result = await blogsRepository.deleteBlog(new ObjectId(req.params.id));
    (result) ? res.sendStatus(204) : res.sendStatus(404);
})


