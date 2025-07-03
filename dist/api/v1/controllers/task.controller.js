"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const pagination_1 = __importDefault(require("../../../helpers/pagination"));
const search_1 = __importDefault(require("../../../helpers/search"));
const index = async (req, res) => {
    const find = {
        deleted: false,
    };
    if (req.query.status) {
        find["status"] = req.query.status;
    }
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue;
    }
    const objectSearch = (0, search_1.default)(req.query);
    if (req.query.keyword) {
        find["title"] = objectSearch.regex;
    }
    const countTask = await task_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItem: 2
    }, req.query, countTask);
    const task = await task_model_1.default.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);
    res.json(task);
};
exports.index = index;
const detail = async (req, res) => {
    const id = req.params.id;
    const task = await task_model_1.default.findOne({
        deleted: false,
        _id: id
    });
    console.log(task);
    res.json(task);
};
exports.detail = detail;
const changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;
        await task_model_1.default.updateOne({
            _id: id
        }, {
            status: status
        });
        res.json({
            code: 200,
            message: "success"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "error"
        });
    }
};
exports.changeStatus = changeStatus;
const changeMulti = async (req, res) => {
    try {
        let Key;
        (function (Key) {
            Key["STATUS"] = "status";
            Key["DELETE"] = "delete";
        })(Key || (Key = {}));
        const ids = req.body.ids;
        const key = req.body.key;
        const value = req.body.value;
        switch (key) {
            case Key.STATUS:
                await task_model_1.default.updateMany({
                    _id: { $in: ids }
                }, {
                    status: value
                });
                res.json({
                    code: 200,
                    message: "success"
                });
                break;
            case Key.DELETE:
                await task_model_1.default.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: true,
                    deletedAt: new Date()
                });
                res.json({
                    code: 200,
                    message: "success"
                });
                break;
            default:
                res.json({
                    code: 400,
                    message: "error"
                });
                break;
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: "error"
        });
    }
};
exports.changeMulti = changeMulti;
const create = async (req, res) => {
    try {
        const task = new task_model_1.default(req.body);
        const data = await task.save();
        res.json({
            code: 200,
            message: "success",
            data: data
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "error"
        });
    }
};
exports.create = create;
const edit = async (req, res) => {
    try {
        const id = req.params.id;
        await task_model_1.default.updateOne({ _id: id }, req.body);
        res.json({
            code: 200,
            message: "success",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "error"
        });
    }
};
exports.edit = edit;
const deleteTask = async (req, res) => {
    try {
        const id = req.params.id;
        await task_model_1.default.updateOne({ _id: id }, {
            deleted: true,
            deletedAt: new Date()
        });
        res.json({
            code: 200,
            message: "success",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "error"
        });
    }
};
exports.deleteTask = deleteTask;
