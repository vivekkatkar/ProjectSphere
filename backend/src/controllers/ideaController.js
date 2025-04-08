const prisma = require("../config/prisma");
require("dotenv").config();
const express = require ("express")
const router = express.Router();

// model Idea {
//     id     Int  @id @default(autoincrement())
//     teamId Int
//     topic String
//     comment String
//     approved Int // 0 -> pending, 1 -> approved, 2 -> rejected
//   }

router.get ("", {

})

router.post ("/", (req, res) => {
    const {semester, email} = req.user;
    
})