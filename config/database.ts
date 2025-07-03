//cat dat mongoose
import mongoose from "mongoose";
//mongoose.connect(process.env.MONGO_URL);
//cat dat mongoose

export const connect=async():Promise<void>=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("susscess");
    }catch(error){
        console.log("error");

    }
}
