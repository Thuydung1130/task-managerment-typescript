"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detail = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const md5_1 = __importDefault(require("md5"));
const generate_1 = require("../../../helpers/generate");
const register = async (req, res) => {
    console.log(req.body);
    const existEmail = await user_model_1.default.findOne({
        email: req.body.email,
        deleted: false
    });
    if (existEmail) {
        res.json({
            code: 400,
            message: "email da ton tai"
        });
    }
    else {
        req.body.password = (0, md5_1.default)(req.body.password);
        req.body.token = (0, generate_1.generateRamdonString)(30);
        const user = new user_model_1.default(req.body);
        const data = await user.save();
        const token = data.token;
        res.cookie("token", token);
        res.json({
            code: 200,
            message: "success",
            token: token
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await user_model_1.default.findOne({
        email: email,
        delete: false
    });
    if (!user) {
        res.json({
            code: 400,
            message: "email khong ton tai"
        });
        return;
    }
    if ((0, md5_1.default)(password) !== user.password) {
        res.json({
            code: 400,
            message: "sai mat khau"
        });
        return;
    }
    const token = user.token;
    res.cookie("token", token);
    res.json({
        code: 200,
        message: "success",
        token: token
    });
};
exports.login = login;
const detail = async (req, res) => {
    res.json({
        code: 200,
        message: "success",
        info: req["user"]
    });
};
exports.detail = detail;
