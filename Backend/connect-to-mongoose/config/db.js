import mongoose from "mongoose";


export const connectMongoDB = async(url) => {
    mongoose.connect(url).then(()=> console.log("connected to Database...")).catch((err)=> console.log("mongodb connection error\n",err));
}
