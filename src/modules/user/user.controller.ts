import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async(req : Request, res: Response) => {
    // console.log(req.body)
   
    try{
        const result = await userService.createUserIntoDb(req.body);
    // console.log(result)
    res.status(201).json({
        "message": ' User Created Successfully!' ,
        "body" : result.rows[0],
       })

    }catch(err : any){
        res.status(500).json({
        message: err.message ,
        error : err,
       });
    }
}

const getUsers = async(req : Request, res: Response) => {
    try{
        const result = await userService.getUsers();
        res.status(200).json({
            "success": true,
            "message": 'User retrieved Successfully!' ,
            "data" : result.rows,
           })

    }catch(err : any){
        res.status(500).json({
        message: err.message ,
        error : err,
       });
    }
}

const getUserById = async(req : Request, res: Response) => {
    const {id} = req.params;
    try{
        const result = await userService.getUserById(id as string);

        if (result.rows.length === 0) {
            return res.status(404).json({
                "success": false,
                "message": 'User not found!' ,
            })
        }
        res.status(200).json({
            "success": true,
            "message": 'User retrieved Successfully!' ,
            "data" : result.rows[0],
        })
    }catch(err : any){
        res.status(500).json({
        message: err.message ,
        error : err,
       });
    }
}

const updateUser = async(req : Request, res: Response) => {
    const {id} = req.params;
    try{
        const result = await userService.updateUser(req.body,id as string);
        if (result.rows.length === 0) {
            return res.status(404).json({
                "success": false,
                "message": 'User not found!' ,
            })
        }
        res.status(200).json({
            "success": true,
            "message": 'User updated Successfully!' ,
            "data" : result.rows[0],
           })
    }catch(err : any){
        res.status(500).json({
        message: err.message ,
        error : err,
       });
    }
}

const deleteUser = async(req : Request, res: Response) => {
    const {id} = req.params;
    try{
        const result = await userService.deleteUser(id as string);
        if (result.rowCount === 0) {
            return res.status(404).json({
                "success": false,
                "message": 'User not found!' ,
            })
        }
        res.status(200).json({
            "success": true,
            "message": 'User deleted Successfully!' ,
            "data" : result.rows[0],
           })
    }catch(err : any){
        res.status(500).json({
        message: err.message ,
        error : err,
       });
    }
}

export const userController = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser

}