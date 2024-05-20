const userModel = require("../model/userModel");


// const SignupPage = (req, res) => {
//     const { error } = req.query;
//     res.status(200).render("signup", { title: "Sign up", error });
// };


const HomePage = (req, res) => {
    const fs = require('fs');
    const { username } = req.cookies;
    fs.readdir('uploads/', (err, files) => {
        userModel.query("SELECT * FROM projects",(err, Result) => {
            res.json({
                username:username,
                files,
                project:Result
            })
            if(err){
                console.log(err);
                res.status(500).send("error ocured " + err)
            }
        });
    });
};


// const loginPage = (req, res) =>{
//     res.status(200).render("login", { error: null, title:"log in", fail:req.query.fail })
// }

// const deleteAccount = (req, res) => {
//     res.status(200).render("deleteUser", { title: "delete page" })
// }

const adminPage = (req, res)=>{
    const username = req.query.username;
    userModel.query('SELECT * FROM users', (err, rows) => {  
        res.json({
            username:username,
            users:rows
        })         
    });
}

const userEdit = (req, res) => {
    const userId = req.params.userId;
    userModel.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows) => {        
        res.json({
            user:user
        })
    });
}

// const formPage = (req, res) => {
//     res.status(200).render("index", { title: "form page" })
// }

const logout = (req, res) => {
    res.clearCookie("username");    
    res.clearCookie("connect.sid");
    res.redirect("/");
};

// const newProject = (req, res) => {
//     res.render("newProject", {title:"add project"})
// }

const getProjects = (req, res) =>{
    userModel.query(`SELECT * FROM projects`, (error , result) =>{
        res.json({
            project:result
        })
    })
}

const allProjects = (req, res) =>{
    const {username} = req.cookies
    userModel.query(`SELECT * FROM projects`, (error , result) =>{
        res.json({
            project:result,
            username
        })
    })
}

const comments = (req, res) => {
    const {id} = req.params
    userModel.query("SELECT * FROM comments  WHERE projectId = ?", [id], (err , result) => {
        res.json({
            id:id,
            comments:result
        })
    })
}



const setting = (req, res) => {
    const {id} = req.params
    userModel.query("SELECT * FROM projects WHERE id = ?", [id], (err, result) => {
        console.log(err);
        userModel.query("SELECT * FROM members  WHERE project_id = ?", [id], (err, members) => {
            console.log(err);
            res.json({
                projectInfo:result,
                members
            })
        })
    })
}

const searchUser = (req, res) => {
    const { username } = req.query; 
    userModel.query("SELECT id, username, email FROM users WHERE username=?", [username], (err, userData) => {
      if (err) {console.log(err); }

      userModel.query("SELECT * FROM projects WHERE user=?", [username], (err, projectsData) => {
          if (err) {
              console.log(err);
          }
          res.json({ user: userData, projects: projectsData }); 
      });
  });
}


const overView = (req, res) => {
    const {id} = req.params
    userModel.query("SELECT * FROM projects WHERE id = ?",[id], (err, projectInfo) => {
        userModel.query("SELECT * FROM members WHERE project_id = ?", [id],(err, membersInfo) => {
            userModel.query("SELECT * FROM topics WHERE project_id = ?", [id], (err, topicInfo) => {
                userModel.query("SELECT * FROM tasks WHERE project_id = ?", [id], (err, taskInfo) => {
                    userModel.query("SELECT * FROM attachments WHERE project_id = ?", [id],(err , attachments) => {
                        res.status(200).json({projectInfo, membersInfo , topicInfo , taskInfo, attachments})
                    } )
                })
            })
        })
    })
}

  

module.exports = {
    HomePage,
    adminPage,
    userEdit,
    logout,
    getProjects,
    comments,
    deletProject, 
    setting,
    searchUser,
    allProjects,
    overView
}