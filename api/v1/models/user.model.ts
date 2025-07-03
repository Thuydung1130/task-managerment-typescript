import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        fullName:String,
        email: String,
        password: String,
        token: String,
        delete:{
            type: Boolean,
            default: false
        },
        
        deletedAt: Date
    },{
        timestamps: true
    }
)
const User = mongoose.model("user", userSchema, "users");
export default User