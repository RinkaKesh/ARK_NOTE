const { authMiddleware } = require("../middlewares/authmiddleware")
const { NoteModel } = require("../models/noteModel")

const noteRoute=require("express").Router()


noteRoute.get("/",async (req , res) => {

    try {
        const allNotes=await NoteModel.find({userId:req.body.userId})
        res.status(200).send({message:"success",data:allNotes})
    } catch (error) {
        res.send({message:error})
    }
    
})
noteRoute.get("/:_id",async (req,res) => {
    
    try {
        const specificNote=await NoteModel.findOne(req.params)
        res.status(200).send({message:"success",data:specificNote})
    } catch (error) {
        res.send({message:error})
    }
    
})

noteRoute.post("/create",async (req ,res) => {
    try {
        const newNote=await NoteModel.create(req.body)
        res.status(201).send({message:"Note created Successfully",data:newNote})
    } catch (error) {
        res.send({message:error})
    }
})


noteRoute.patch("/edit/:id",async (req,res) => {
    try {
        const noteToEdit=await NoteModel.findById({_id:req.params.id})
        await NoteModel.findByIdAndUpdate({_id:req.params.id},{...noteToEdit._doc,...req.body})
        res.status(201).send({message:"Note Edited Successfully",data:{...noteToEdit._doc,...req.body}})
    } catch (error) {
        res.status(500).send({message:error})
    }
})

noteRoute.delete("/delete/:id",async (req ,res) => {
    try {
        const noteToDelete=await NoteModel.findByIdAndDelete({_id:req.params.id})
        res.status(204).send({message:"Note deleted successfully",data:noteToDelete})
    } catch (error) {
        res.status(500).send({message:error})
    }
})

module.exports={noteRoute}