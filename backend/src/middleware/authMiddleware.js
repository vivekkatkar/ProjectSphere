const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

exports.authenticateToken = (req, res, next) => {
    console.log("Authenticating user......");
    //for guide login
    // const user = { role: "1", email: "abc@gmail.com" }

    // for student login
    // const user = { semester: "2", email: "pratikshahire21@gmail.com" }

    const token = req.header("Authorization")?.split(" ")[1];
    // console.log(req.header("Authorization"));

    if (!token) return res.status(403).json({ message: "Access denied" });
    // console.log (token);
    jwt.verify(token, SECRET_KEY, (err, user) => { 
        if (err) return res.status(403).json({ message: "Invalid token" });
        console.log("User from auth token : ", user);
        req.user = user;    
        console.log (user);
        next();
    });
    // req.user = user;
    // next();
};
