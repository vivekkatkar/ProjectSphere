const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

exports.authenticateToken = (req, res, next) => {

    //for guide login
    const user = { role: "1", email: "abc@gmail.com" }

    // for student login
    // const user = { semester: "2", email: "pratikshahire21@gmail.com" }

    // const token = req.header("Authorization")?.split(" ")[1];
    // if (!token) return res.status(403).json({ message: "Access denied" });
    // console.log (token);
    // jwt.verify(token, SECRET_KEY, (err, user) => { 
    //     if (err) return res.status(403).json({ message: "Invalid token" });
    //     req.user = user;    
    //     console.log (user);
    //     next();
    // });
    req.user = user;
    next();
};
