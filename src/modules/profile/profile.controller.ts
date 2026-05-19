import type { Request, Response } from "express";
import { profileService } from "./profile.service";

const createProfile =async (req:Request, res:Response) => {
    try{
        const result = await profileService.createProfileIntoDB(req.body);
        res.status(201).json({
            "success": true,
            "message": 'Profile Created Successfully!' ,
            "data" : result.rows[0],
        })
    }catch(err : any){
        res.status(500).json({
        success: false,
        message: err.message ,
        error : err,
       });
    }

}

export const profileController = {
    createProfile
}