import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
export const requireAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (req.headers.authorization) {
        const token: string = req.headers.authorization.split(" ")[1];
        const user = await User.findOne({
            token: token,
            delete: false
        }).select("-password")
        if (!user) {
            res.json({
                code: 400,
                message: "token ko hop le"
            })
            return;
        }

        req["user"] = user
        //console.log(req.headers.authorization);
        next();
    }
    else {
        res.json({
            code: 400,
            message: "vui long gui kem token"
        })
    }
};
