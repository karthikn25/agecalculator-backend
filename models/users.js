import mongoose from "mongoose";
import jwt from  'jsonwebtoken';

const userSchema = new mongoose.Schema(
    {
        name: {
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
        contact:{
            type : Number
           
        },
        user:{
            type:mongoose.Schema.Types.ObjectId
        }
        
        
       
    }
)
const genetrateJwtToken = (id)=>{
    return jwt.sign({id},process.env.SECRET_KEY)
}


const User = mongoose.model("user",userSchema)

export {User,genetrateJwtToken}