import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import { addFood } from "./controllers/foodController.js";
import path from 'path';
import { fileURLToPath} from "url";
import userRouter from "./routes/userRoute.js";
import "dotenv/config.js"
import dotenv from "dotenv"
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

//app config
const app=express();
dotenv.config();
const port=4000;
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

//middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use('/images',express.static(path.join(__dirname,'upload')));
app.use('/api/user',userRouter);

//dbconnection
connectDB();

//api endpoints
app.use("/api/food",foodRouter);
app.use("/image",express.static('upload'))
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
res.send("API working");
})

app.listen(port,()=>{
    console.log(`server is listing on  ${port}`)
})

