const prisma = require("../config/prisma");
require("dotenv").config();
const express = require ("express")
const router = express.Router();

router.get("/profile", );
router.get("/idea", );
router.get ("/weeklyReport", )
router.get ("/notification", )

exports.profile = async (req, res) => {
	const {semester, email} = req.user;
	console.log (semester, email);
	try{
		const user = await prisma.student.findUnique({
			where: {
				semester,
				email
			}
		});
		if (!user) {
			res.json ({"message" : "failed"});
			return;
		}
		console.log (user);
		res.json ({message : "Success", "data" : user})
	}
	catch(e){
		console.log (e);
		res.json ({"message" : "Failed", "data" : e});
	}

	return

	res.json({"message" : "hey ya from server"})
};

exports.getAll = async (req, res) => {
	try{
		const semester = req.user.semester;
		console.log ("semester is :(" ,semester);
		const data = await prisma.student.findMany({
			where : {semester}
		});
		console.log (data);
		return res.json ({message : "success", data})
	}
	catch(error){
		res.json ({message : "fail", error});
	}

}
 
async function addOtherMembers (team, teamId, semester){
	let id = teamId
	for (let i = 2; i < team.length; i++){
		let name = team[i].name, prn = team[i].prn
		await prisma.team.create ({ data : {semester ,name, prn, id}});
	} 
} 


// model team {
// 	id       Int    @id @default(autoincrement())
// 	prn      String
// 	semester Int
// 	name     String
// 	batchId  Int?
// 	guideId  Int?
  
// 	@@index([batchId], map: "Team_batchId_fkey")
// 	@@index([guideId], map: "Team_guideId_fkey")
//  }

exports.createTeam = async (req, res) => {
	try{
		const data = req.body;
		let semester = req.user.semester, name = data.team[1].name, prn = data.team[1].prn;
		console.log (semester, name, prn);
		// await prisma.student.create({
        //     data: { name, email, password: hashedPassword, prn, semester },
        // });
		const user = await prisma.team.create ({data : {semester, name, prn }})
		const teamId = user.id;

		console.log (user);

		// return res.json ("ok");

		await addOtherMembers (data.team, teamId, semester);

		res.json ({"message" : "success"});	
	}
	catch (e){
		console.log (e);
	}

}