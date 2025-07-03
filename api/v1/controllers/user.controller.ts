import { Request, Response } from "express";
import User from "../models/user.model";
import md5 from "md5"
import { generateRamdonString } from "../../../helpers/generate";
// [POST] /api/v1/users/register
export const register = async (req: Request, res: Response) => {
    console.log(req.body);

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })
    if (existEmail) {
        res.json({
            code: 400,
            message: "email da ton tai"
        })
    } else {
        req.body.password = md5(req.body.password);
        req.body.token = generateRamdonString(30)

        const user = new User(req.body);
        const data = await user.save();

        const token = data.token;
        res.cookie("token", token)
        res.json({
            code: 200,
            message: "success",
            token: token
        })
    }

};

export const login = async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;
    const user = await User.findOne({
        email: email,
        delete: false
    })
    if (!user) {
        res.json({
            code: 400,
            message: "email khong ton tai"
        })
        return;
    }
    if (md5(password) !== user.password) {
        res.json({
            code: 400,
            message: "sai mat khau"
        })
        return;
    }
    const token = user.token;
    res.cookie("token", token)
    res.json({
        code: 200,
        message: "success",
        token: token
    })
}

export const detail = async (req: Request, res: Response) =>{
    // const id:string=req.params.id;
    // const user=await User.findOne({
    //     _id:id,
        
    //     delete: false
    // }).select("-password -token");
    res.json({
        code:200,
        message: "success",
        info: req["user"]
    })
}