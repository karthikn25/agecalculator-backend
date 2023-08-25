import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()
const Mongoose_Url = process.env.Mongoose_Url
export function dbConnection(){
    const params = {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }
    try {
        mongoose.connect(Mongoose_Url,params)
        console.log("Database connected sucessfully")
    } catch (error) {
        console.log("Error in db connection",error)
    }
}