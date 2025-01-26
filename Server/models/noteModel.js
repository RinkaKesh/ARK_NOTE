const mongoose=require("mongoose")


const noteSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"user"}
},{
    versionKey:false 
})


const NoteModel=mongoose.model("notes",noteSchema)

module.exports={NoteModel}