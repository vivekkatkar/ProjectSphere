
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

// model guide {
//     id       Int    @id @default(autoincrement())
//     name     String
//     password String
//     role     String
//     email    String @unique(map: "Guide_email_key")
//     semester Int
//   }

exports.signup = async (req, res) => {
  
  let { name, email, password, role, phone, semester } = req.body;
  semester = parseInt(semester);

  try {
    console.log(name, email, password, role, phone, semester);
    const existingUser = await prisma.guide.findFirst({ where: { email } });
    console.log(existingUser);
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    await prisma.guide.create({
      data: { name, email, password: hashedPassword, role, phone, semester },
    });

    const token = jwt.sign({ role: role, email: email }, SECRET_KEY);

    res.json({ message: "registered successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


exports.login = async (req, res) => {
  const { email, password, semester } = req.body;

  console.log("Inside guide auth controller");
  console.log(req.body);

  try {
    const user = await prisma.guide.findUnique({ where: { email } });
    if (!user)
      return res
        .status(401)
        .json({ message: "fail", error: "Account does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "fail", error: "Invalid email or password" });

    const token = jwt.sign(
      { role: user.role, email: user.email },
      SECRET_KEY
    );

    const role = user.role;
    res.json({ message: "success", token, role, email });
  } catch (error) {
    res.status(500).json({ message: "fail", error: error.message });
  }
};
