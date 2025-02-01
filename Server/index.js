const express = require("express")
const cors = require("cors")
require("dotenv").config()
const connection = require("./config/connection")
const {noteRoute} = require("./routes/noteRoute")
const {userRoute} = require("./routes/userRoute")
const {authMiddleware} = require("./middlewares/authmiddleware")

const app = express()

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "https://arknote.vercel.app",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS',"PATCH"],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.options("*", cors());
app.use(express.json())

// Add a root route for testing
app.get('/', (req, res) => {
    res.json({ message: "Server is running" })
})

app.use("/notes", authMiddleware, noteRoute)
app.use("/user", userRoute)

// For Vercel, we export the app instead of calling listen
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8000
    app.listen(PORT, async () => {
        try {
            await connection()
            console.log("connected to db")
        } catch (error) {
            console.log(error)
        }
    })
}

// Connect to database for production
if (process.env.NODE_ENV === 'production') {
    connection()
        .then(() => console.log("Production DB connected"))
        .catch(err => console.log("Production DB error:", err))
}

module.exports = app