import {validationResult, ValidationError} from "express-validator";
import {NextFunction, Response, Request} from "express";

export const errorsValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const errorFormatter = ({ msg, param }: ValidationError) => {
        return {
            message: msg,
            field: param,
        };
    };

    const result = validationResult(req).formatWith(errorFormatter);
    if (!result.isEmpty()) {
        res.status(400).json({ errorsMessages: result.array() });
    } else {
        next()
    }
}