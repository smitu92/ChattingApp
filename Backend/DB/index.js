import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const mongoUrl=process.env.Mongo_URL;
export default async function Main() {
     mongoose.connect(mongoUrl).then(()=>{
         console.log("MongoDb is successfully connected");
     }).catch((e)=>{
        console.log(e);
     })
}