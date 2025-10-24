import express from 'express'
import { v2 as cloudinary } from 'cloudinary'
import path from "path";
const router=express.Router();
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();
/*  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  ); */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "images")); // save in Backend/images
  },
  filename: function (req, file, cb) {
    // Add timestamp + original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});
// app.use("/images", express.static(path.join(process.cwd(), "images")));


const upload = multer({ storage });
        cloudinary.config({ 
  cloud_name:process.env.CLOUDINARYCLOUDNAME , 
  api_key:process.env.CLOUDINARYAPIKEY,
  api_secret:process.env.CLOUDINARYAPISECREAT 
});
// const upload=multer({dest:"../../images"})  
router.post("/image",upload.single("file"),async (req,res)=>{
    console.log("hellow this is our image buddu")
         const file=req.body;
         console.log(req.file);
         console.log(file);
        // res.status(200);
        //  console.log()
        console.log(cloudinary.config());
        try {
           const r = await cloudinary.uploader.upload(req.file.path);
           console.log(r);
        } catch (error) {
            console.log(error);
        }
       


})


export default router;