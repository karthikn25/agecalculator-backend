import mongoose from "mongoose";
import jwt from  'jsonwebtoken';

const userSchema = new mongoose.Schema(
    {
        username: {
            type : String,
            required : true,
            maxlength : 35,
            trim : true
        },
        email:{
            type : String,
            required : true,
            unique : true,
            trim:true
        },
        password:{
            type : String,
            required : true
        },
        resetToken: String
       
        
        
       
    }
)
const genetrateJwtToken = (id)=>{
    return jwt.sign({id},process.env.SECRET_KEY)
}


const User = mongoose.model("user",userSchema)

export {User,genetrateJwtToken}