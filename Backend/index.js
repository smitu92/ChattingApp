import express from 'express';
import authRoute from "./Routers/Auth/signup2.0/webhook.js"
import Main from './DB/index.js';
import { jsonWithRaw } from './middleware/raw.js';
import cors from 'cors';
import UploadImageRoute from './Routers/upload/imageupload.js'
import searchRoute from './Routers/App/searchUsers.js'
import insertionRoomId from './Routers/App/adduserIntoChatRoom.js'
const app=express();

var whitelist = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:2000"
];

const corsOptions={
    origin:whitelist,
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"]
}
// app.use((req, res, next) => {
//   console.log("Origin:", req.headers.origin);
//   next();
// });

await Main();
app.use(cors(corsOptions));
app.use(jsonWithRaw);
express.urlencoded();

/* create Router/routers */
const UploadRouter=express.Router();

//some basic routes for data 
const basicRouters=express.Router();


//route "/"
const slashRoutes=express.Router();

UploadRouter.use("/",UploadImageRoute);
basicRouters.use("/",searchRoute);

slashRoutes.use("/",insertionRoomId);
slashRoutes.use("/",searchRoute);

app.use("/",slashRoutes);
app.use("/auth",authRoute);
app.use("/upload",UploadRouter);


app.listen(2001,()=>{
        console.log("chat App is started on 2001");
})