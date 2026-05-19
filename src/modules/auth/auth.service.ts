import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";
const loginUserIntoDB = async (payload : {
    email : string,
    password : string
}) => {
    const {email,password} = payload;
    //cheack if the user exists
    //check if the password is correct
    //genarate token
    
    const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1

        `, [email]);

    if (userData.rows.length === 0) {
        throw new Error('User not found!');
    }
    const user = userData.rows[0];
    const isPasswordMatch = await bcrypt.compare(password,user.password);
    if (!isPasswordMatch) {
        throw new Error('Invalid password!');
    }

    // token genarate
    const jwtpayload = {
        id : user.id,
        name : user.name,
        email : user.email,
        is_active : user.is_active,
    }

    const accesstoken = jwt.sign(jwtpayload,config.secret as string,{
        expiresIn : "1d",
    })




    return {accesstoken};
    
    
}

export const authService = {
    loginUserIntoDB
}