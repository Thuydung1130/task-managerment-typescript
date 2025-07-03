"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const requireAuth = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = await user_model_1.default.findOne({
            token: token,
            delete: false
        }).select("-password");
        if (!user) {
            res.json({
                code: 400,
                message: "token ko hop le"
            });
            return;
        }
        req["user"] = user;
        next();
    }
    else {
        res.json({
            code: 400,
            message: "vui long gui kem token"
        });
    }
};
exports.requireAuth = requireAuth;
