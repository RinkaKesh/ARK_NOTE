const express=require("express")
const cors=require("cors")
require("dotenv").config()
const connection=require("./config/connection")

const {noteRoute}=require("./routes/noteRoute")
const {userRoute}=require("./routes/userRoute")

const {authMiddleware}=require("./middlewares/authmiddleware")

const app=express()
app.use(cors({
    origin: ['http://localhost:5173', 'https://ark-note-rinka-keshs-projects.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, 
  }));
  app.options('*', cors());
app.use(express.json())


app.use("/notes",authMiddleware,noteRoute)
app.use("/user",userRoute)


app.listen(process.env.PORT,async()=>{
    try {
        await connection()
        console.log("connected to db");
        
    } catch (error) {
        console.log(error);
        
    }
})