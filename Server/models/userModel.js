const mongoose=require("mongoose")


const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    googleId: {type: String}
},{
    versionKey:false,
    toJSON:{virtuals:true} 
})
userSchema.virtual("allnotes",{
    ref:"notes",
    localField:"_id",
    foreignField:"userId"
})
const UserModel=mongoose.model("user",userSchema)

module.exports={UserModel}