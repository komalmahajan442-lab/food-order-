import mongoose from "mongoose";

export const  connectDB=async()=>{
    await mongoose.connect('mongodb+srv://komalmahajan:1a2b3c4d5e@cluster0.kazn482.mongodb.net/foodOrder').then(()=>console.log('DB connected'));
}