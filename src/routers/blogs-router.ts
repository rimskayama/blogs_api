import {Request, Response, Router} from 'express'
import {blogsRepository} from "../repositories/blogs-repository";
import {errorsValidationMiddleware} from "../middlewares/errorsValidationMiddleware";
import {
    blogDescriptionValidationMiddleware,
    blogNameValidationMiddleware, blogWebsiteUrlValidationMiddleware
} from "../middlewares/blogsBodyValidationMiddleware";
import {basicAuthMiddleware} from "../middlewares/basicAuth";


export const blogsRouter = Router({})

//GET
blogsRouter.get("/", (req: Request, res: Response) => {
    const allBlogs = blogsRepository.findBlogs(req.body.name)
    res.status(200).json(allBlogs)
})


//GET WITH URI
blogsRouter.get("/:id", (req: Request, res: Response) => {
    let blog = blogsRepository.findBlogById(req.params.id);
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
    errorsValidationMiddleware,
    (req: Request, res: Response) => {

        const newBlog = blogsRepository.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
        console.log('new', newBlog)
        res.status(201).json(newBlog)
})

//PUT
blogsRouter.put("/:id",
    basicAuthMiddleware,
    blogNameValidationMiddleware,
    blogDescriptionValidationMiddleware,
    blogWebsiteUrlValidationMiddleware,
    errorsValidationMiddleware,
    (req: Request, res: Response) => {
    const updatedBlog = blogsRepository.updateBlog(
        req.params.id, req.body.name, req.body.description, req.body.websiteUrl
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
    (req: Request, res: Response) => {
    const isDeleted = blogsRepository.deleteBlog(req.params.id);
    (isDeleted) ? res.sendStatus(204) : res.sendStatus(404);
})


