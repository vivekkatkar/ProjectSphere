const prisma = require("../config/prisma");
require("dotenv").config();
const express = require ("express")
const router = express.Router();

// router.get("/profile", );
// router.get("/idea", );
// router.get ("/weeklyReport", )
// router.get ("/notification", )

exports.profile = async (req, res) => {
		console.log(req.user);
	let {semester, email} = req.user;
	semester =  parseInt(semester);
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
		const semester = parseInt(req.user.semester);
		console.log ("semester is :(" ,semester);

		const data = await prisma.student.findMany({
			where : {
				semester : semester,
				teamId : null
			},
			select : {
				id : true,
				name : true,
				prn : true	
			}
		});
		// console.log (data);
		return res.json ({message : "success", data})
	}
	catch(error){
		// console.log(error);
		res.json ({message : "fail", error});
	}
}

async function addTeamIDForOtherMembers(team, teamId, semester) {
	const id = teamId;
	for (let i = 0; i < team.length; i++) {
	  await prisma.student.update({
		where: { semester: semester, prn: team[i].label },
		data: { teamId: id },
	  });
	}
  }
  
  exports.createTeam = async (req, res) => {
	try {
	  const data = req.body.team;
	  const name = req.body.teamName;
	  const year = req.user.year;
	  let semester = req.user.semester;
		console.log ("in create team ",  year);
	//   console.log (`create team \n : ${data}` );

	  const user = await prisma.team.create({ data: { semester, name, year   } });
	  const teamId = user.id;
		console.log (`teamId is ${teamId}`);
	  await addTeamIDForOtherMembers(data, teamId, semester); //data is array of students
  
	  return res.status(201).json({
		status: "success",
		message: "Team created successfully",
	  });
	} catch (e) {
	  console.log(e);
	  return res.status(500).json({
		status: "failed",	
		message: "Failed to create team",
	  });
	}
  };


  // team details 

  exports.getTeamDetails = async (req, res) => {
	// join => team and student teamId on id => return name and prn
	const teamId = parseInt(req.params.id);
	const {semester, email} = req.user;

	// console.log (semester, email);
	// const projects = await prisma.project.findMany({
	// 	include: {
	// 	  student: true,
	// 	},
	//   });
	
	const teams = await prisma.student.findMany({
		where : {
			semester : semester,
			teamId : teamId
		}
	});
	console.log (`team details : ${JSON.stringify(teams, null, 2)}`);
	return res.json ({message : "success", data : teams});

  }


// Add idea

exports.addIdea = async (req, res) => {
    console.log("Inside Add idea");
    try {
      const email = req.user.email;
      const student = await prisma.student.findUnique({
        where: { email },
      });
      
      console.log("Fetched student data", student);

      if (!student || !student.teamId) {
        return res.status(400).json({ message: "Student or team not found" });
      }
  
      const { topic } = req.body;
      
      console.log("Extracted topic ", topic);

      if (!topic || topic.trim() === "") {
        return res.status(400).json({ message: "Topic is required" });
      }
      
      console.log("started data insertion");
      const newIdea = await prisma.idea.create({
        data: {
          topic,
          comment: "",         // Empty for now, will be updated by guide later
          approved: 0,         // 0 -> pending
          teamId: student.teamId,
        },
      });
  
      return res.status(201).json({
        status: "Success",
        message: "Idea submitted successfully",
        idea: newIdea,
      });
  
    } catch (error) {
      console.error("Error submitting idea:", error);
      return res.status(500).json({
        status: "Error",
        message: "Failed",
      });
    }
  }

exports.getAllIdeas = async (req, res) => {
    try {
      const email = req.user.email;
  
      const student = await prisma.student.findUnique({
        where: { email },
      });
  
      if (!student || !student.teamId) {
        return res.status(404).json({ message: "Student or team not found" });
      }
  
      const ideas = await prisma.idea.findMany({
        where: {
          teamId: student.teamId,
        },
      });
  
      return res.status(200).json({
        status: "Success",
        ideas,
      });
  
    } catch (error) {
      console.error("Error fetching student ideas:", error);
      return res.status(500).json({
        status: "Error",
        message: "Failed to fetch student ideas",
      });
    }
  }


//   router.get('/reports', authenticateToken, displayAllReports);

// model report {
// 	id        Int      @id @default(autoincrement())
// 	teamId    Int?
// 	file      Bytes
// 	createdAt DateTime @default(now())
  
// 	team      team?    @relation(fields: [teamId], references: [id])
  
// 	@@index([teamId], map: "Report_teamId_fkey")
//   }

exports.displayAllReports = async (req, res) => {
	try {
		const teamId = parseInt(req.user.teamId);
		const reports = await prisma.report.findMany({
			where: { teamId },
		});

		const formatted = reports.map((report, idx) => ({
			id: report.id,
			week: idx + 1,
			downloadUrl: `/student/report/${report.id}/download`,
		  }));

		res.status(200).json({
			status: "success",
			message: "Reports fetched successfully!",
			reports: formatted,
		});
	} catch (e) {
		console.error(e);
		res.status(500).json({
			status: "failed",
			message: "Failed to fetch all reports!",
		});
	}
};

//   router.post('/upload', authenticateToken, addReport);

exports.addReport = async (req, res) => {
	try {
		const teamId = parseInt(req.user.teamId);
		const fileBuffer = req.file.buffer;
	
		const report = await prisma.report.create({
		  data: {
			teamId,
			file: fileBuffer, 
			
		  }
		});
	
		res.status(200).json({ message: "Report uploaded", report });
	  } catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to upload report" });
	  }
}


