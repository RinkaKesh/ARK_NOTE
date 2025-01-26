require("dotenv").config()
const jwt=require("jsonwebtoken")

const authMiddleware=async (req,res,next) => {
    try {
        const token=req.headers.authorization?.split(" ")[1]
        if(!token){
           return res.status(401).send({message:"Unauthorized Access"})
        }
        jwt.verify(token,process.env.SECRET_KEY,(err,decode)=>{
            if(err){return res.status(403).send({message:"Something went wrong"})}
            req.body.userId=decode.userId
            req.body.username=decode.username
            req.body.expiresIn=decode.expiresIn

            next()
        })
    } catch (error) {
        res.status(500).send({ message: "Server Error" })
    }
}

module.exports={authMiddleware}