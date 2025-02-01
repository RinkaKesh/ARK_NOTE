const mongoose=require("mongoose")


const noteSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"user"},
    startDate:{type:Date,required:true},
    endDate:{type:Date,required:true,
        validate:{
            validator:function(value){
                return value>=this.startDate
            },
            message:"End date must be later than or equal to the start date."
        }
    },
    status:{
        type:String,
        enum: ["todo", "active", "completed", "overdue"], 
        default:"todo"
    }
},{
    versionKey:false 
})


const NoteModel=mongoose.model("notes",noteSchema)

module.exports={NoteModel}