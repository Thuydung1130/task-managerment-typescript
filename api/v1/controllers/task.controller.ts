import { Request, Response } from "express"
import Task from "../models/task.model"
import paginationHelper from "../../../helpers/pagination"
import searchHelper from "../../../helpers/search"
export const index = async (req: Request, res: Response) => {
    const find = {
        deleted: false,
    }
    //find
    if (req.query.status) {
        find["status"] = req.query.status
    }
    //end-find

    //sort
    const sort = {}
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue;
    }
    //end-sort

    //search
    const objectSearch = searchHelper(req.query);
    if (req.query.keyword) {
        find["title"] = objectSearch.regex;
    }
    //end-search


    //pagination
    const countTask = await Task.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 2
        },
        req.query,
        countTask
    )
    //end-pagination

    const task = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);
    //console.log(task)
    res.json(task)
}

export const detail = async (req: Request, res: Response) => {
    const id = req.params.id;
    const task = await Task.findOne({
        deleted: false,
        _id: id
    })
    console.log(task)
    res.json(task)
}

export const changeStatus = async (req: Request, res: Response) => {
    try {
            const id = req.params.id;
            const status = req.body.status;
            await Task.updateOne({
    
                _id: id
            }, {
                status: status
            })
            res.json({
                code: 200,
                message: "success"
            })
        } catch (error) {
            res.json({
                code: 400,
                message: "error"
            })
        }
}

export const changeMulti = async (req: Request, res: Response) =>{
    try {
            enum Key {
                STATUS="status",
                DELETE="delete"
            }
            const ids:string[]=req.body.ids;
            const key:string=req.body.key;
            const value: string=req.body.value
            switch (key) {
                case Key.STATUS:
                    await Task.updateMany({
                        _id: { $in: ids }
                    }, {
                        status: value
                    })
                    res.json({
                        code: 200,
                        message: "success"
                    })
                    break;
                case Key.DELETE:
                    await Task.updateMany({
                        _id: { $in: ids }
                    }, {
                        deleted:true,
                        deletedAt: new Date()
                    })
                    res.json({
                        code: 200,
                        message: "success"
                    })
                    break;
                default:
                    res.json({
                        code: 400,
                        message: "error"
                    })
                    break;
            }
    
        } catch (error) {
            res.json({
                code: 400,
                message: "error"
            })
        }
}

export const create = async (req: Request, res: Response) =>{
    try {
            //req.body.createdBy=req.user.id;
            const task= new Task(req.body);
            const data= await task.save();
    
            res.json({
                code:200,
                message: "success",
                data: data
            })
        } catch (error) {
            res.json({
                code: 400,
                message: "error"
            })
        }
}

export const edit = async (req: Request, res: Response) =>{
    try {
            const id:string=req.params.id;
            await Task.updateOne({_id:id},req.body);
            res.json({
                code:200,
                message: "success",
                
            })
        } catch (error) {
            res.json({
                code: 400,
                message: "error"
            })
        }
}

export const deleteTask = async (req: Request, res: Response) =>{
    try {
            const id:string=req.params.id;
            await Task.updateOne({_id:id},{
                deleted: true,
                deletedAt: new Date()
            });
            res.json({
                code:200,
                message: "success",     
            })
        } catch (error) {
            res.json({
                code: 400,
                message: "error"
            })
        }
}