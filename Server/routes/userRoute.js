const express= require("express")
require("dotenv").config()
const userRoute=express.Router()
const { UserModel } = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


userRoute.get("/", async (req, res) => {
    try {
        const allUsers = await UserModel.find()
        res.status(200).send({ message: "success", data: allUsers })
    } catch (error) {
        res.send({ message: error })
    }
})

userRoute.get("/:_id", async (req, res) => {
    try {
        const specificUser = await UserModel.findById(req.params)
        res.status(200).send({ message: "success", data: specificUser })
    } catch (error) {
        res.send({ message: error })
    }
})

userRoute.patch("/edit/:id",async (req,res) => {
    try {
        const userToEdit=await UserModel.findById({_id:req.params.id})
        await UserModel.findByIdAndUpdate({_id:req.params.id},{...userToEdit._doc,...req.body})
        res.status(201).send({message:"Profile Updated Successfully",data:{...userToEdit._doc,...req.body}})
    } catch (error) {
        res.status(500).send({message:error})
    }
})

userRoute.post("/register", async(req, res) => {
    try {
        const { name, email, password } = req.body
        // console.log(req.body);
        
        const CheckIfnewUser = await UserModel.findOne({ email })
        if (CheckIfnewUser) { return res.status(409).send({ message: `User with this Email : ${email} already exist` }) }

        const hashedPassword = await bcrypt.hash(password,5)
        if (!hashedPassword) {
            return res.status(500).send({ message: "something went wrong, try later" })
        }
        const newUser = await UserModel.create({name,email, password: hashedPassword })
        //  console.log(newUser);        
        res.status(201).send({ message:`${name} successfully registered`,data:newUser})

    } catch (error) {
        res.status(500).send({ message:"server error" })
    }
})

userRoute.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body
        const CheckIfUser = await UserModel.findOne({ email })
        if (!CheckIfUser) { return res.status(404).send({ message: `User not found` }) }     
        
        const validPassword=await bcrypt.compare(password,CheckIfUser.password)
        
        if(!validPassword){return res.status(401).send({message:"Invalid Credentials"})}
       
        const { password: _, ...userProfileWithoutPassword } = CheckIfUser.toObject();
         jwt.sign({userId:CheckIfUser._id,username: CheckIfUser.name},process.env.SECRET_KEY,{expiresIn:"10h"},(err, token) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
          res.send({ message:`${CheckIfUser.name} successfully logged in`,token: token,profile:userProfileWithoutPassword})
        })
    } catch (error) {
        res.status(500).send({ message: "Server Error" })
    }
})

module.exports = { userRoute }