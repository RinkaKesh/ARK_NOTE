const express = require("express")
const cors = require("cors")
require("dotenv").config()
const connection = require("./config/connection")
const {noteRoute} = require("./routes/noteRoute")
const {userRoute} = require("./routes/userRoute")
const {authMiddleware} = require("./middlewares/authmiddleware")
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const app = express()

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "https://takenote-livid.vercel.app",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS',"PATCH"],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.options("*", cors());
app.use(express.json())

//google auth
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Passport serialization
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
  
  // Set up Google Strategy
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/user/auth/google/callback", 
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let existingUser = await UserModel.findOne({ email: profile.emails[0].value });
        
        if (existingUser) {
          return done(null, existingUser);
        }
        
        // Create new user if doesn't exist
        const newUser = await UserModel.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: "google-oauth-" + Math.random().toString(36).substring(2),
          googleId: profile.id
        });
        
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  ));

//test route
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