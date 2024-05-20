const userModel = require("../model/userModel");
const bcrypt = require('bcrypt');


const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    userModel.query(`SELECT * FROM users WHERE username = ? AND email = ?`, [username , email], (error, result) => {
      if (result.username === req.body.username  && result.email === req.body.email) {
          console.log(result);
          res.json({messge:"error occured signup"})
      } else {
        userModel.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, result) => {
            if (err) {
                res.status(500).send('Error registering user');
                return;
            }
            res.cookie('username', `${username}`, { maxAge: 900000, httpOnly: true });
            console.log('User registered successfully');
            res.json({message:"user sign up succesfuly"})
        });
      }
    });
}


const login = async (req, res) => {
    const { username, password } = req.body;
    userModel.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            res.cookie('username', `${username}`, { maxAge: 900000, httpOnly: true });
            req.session.user = user;
            if (user.is_admin === 1) {
              res.json({message:"this is admin user", user:results})
          } else {
              res.json({message:"nonAdmin", user:results})
          }
        } else {   
            res.status(401).send('Invalid username or password');
        }
    });
}


const deleteuser = (req, res) => {
    const { username } = req.cookies; 
    if (!username) {
        return res.status(400).send('Username not found in cookies');
    }
    userModel.query(`DELETE FROM comments WHERE user = ?`, [username], (err, commentResult) => {
        if (err) {
            console.error('Error deleting comments:', err);
            return res.status(500).send('Error deleting comments');
        }
        userModel.query("DELETE FROM users WHERE username = ?", [username], (err, result) => {
            if (err) {
                console.error('Error deleting user:', err);
                return res.status(500).send('Error deleting user');
            }           
            if (result.affectedRows > 0) {  
                res.clearCookie("username");    
                res.clearCookie("connect.sid");             
                res.status(200).redirect("/"); 
            } else {
                res.status(404).send('User not found');
            }
        });
    });
};


const userEditPost = (req, res) => {
    const userId = req.params.userId;
    const { is_admin } = req.body; 
    userModel.query('UPDATE users SET is_admin = ? WHERE id = ?', [is_admin, userId], (err, result) => {
        if (err) {
            console.error('Error updating user data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json({message:"admin update a user", user:result})
    });
}

const userDeletePost = (req, res) => {
    const userId = req.params.userId;

    userModel.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        res.json({message:"admin delete user", user:result})
    });
}



const addProject = (req, res) => {
    const {name , description} = req.body
    userModel.query(`INSERT INTO projects (name , description, user) VALUES (?, ?, ?)`, [name , description , `${req.cookies.username}`], (err, result) => {
        if(!err){
            console.log(result);
            res.json({message:"add new project", data:{title:name, description:description, user:`${req.cookies.username}`}})
        }else{
            console.log(err);
        }
    })
}

const addComments = (req, res) => {
    const {username} =  req.cookies
    userModel.query(`INSERT INTO comments ( user , comment , projectId ) VALUES ('${username}', '${req.body.comment}', '${req.params.id}')`, (err , result) => {
       if(!err){
           res.json({message:"commit add database", data: {user:`${req.cookies.username}`, comment:`${req.body.comment}`, projectId:`${req.params.id}`}})
       }
       console.log(err);
    })
}

const deleteComments = (req, res) => {
    const {commentid} = req.params
    userModel.query(`DELETE FROM comments WHERE id = ?`, [commentid], (err, deletecommit) => {
        if(!err){
            res.json({message:"comment deleted"})
        }
    })
}

const udateCommit = (req, res) => {
    userModel.query(`UPDATE comments SET comment = '${req.body.comment}' WHERE id=${req.params.commentid}`, (err, result) =>{
        if(!err){
            res.json({message:"commit updated", data:{comment:`${req.body.comment}`}})
        }else{
            console.log(err);
        }
    })
}

const updateProject = (req, res) => {
    const { name, description , id} = req.body;

    userModel.query("UPDATE projects SET name = ?, description = ? WHERE id = ?", [name, description, id], (err, result) => {
        if (err) {
            console.error("Error updating project:", err);
            return res.status(500).send("Error updating project");
        }
        res.redirect("/home")
    });
};

const deletProject = (req, res) => {
    const {id} = req.params
    userModel.query("DELETE FROM projects WHERE id =? ", [id], (err) =>{
        res.redirect('/home')
    })
}

const memberAdd =  (req, res) => {
    const { username , projectId} = req.body;
    userModel.query('INSERT INTO members (project_id, username) VALUES (?, ?)', [projectId, username], (err, result) => {
      res.redirect(`/setting/projectSetting/${projectId}`)
    });
};

const addTopic = (req, res) => {
    const { username } = req.cookies;
    const projectId = req.params.id;
    const topic = req.body.topic;
    userModel.query( `INSERT INTO topics (username, project_id, topic) VALUES (?, ?, ?)`, [username, projectId, topic], (err, data) => {
        console.log('Topic added successfully');
        res.redirect(`/project/OverView/${projectId}`);
    });
};

const addTask = (req, res) => {
    const projectId = req.params.id;
    const description = req.body.description;
    userModel.query( `INSERT INTO tasks ( project_id, description) VALUES (?, ?)`, [ projectId, description], (err, data) => {
        console.log('task added successfully');
        res.redirect(`/project/OverView/${projectId}`);
    });
};

const addAttachment = (req, res) => {
    const { username } = req.cookies;
    const projectId = req.params.id;
    const filePath = req.file.filename;
  
    userModel.query(`INSERT INTO attachments (username, project_id, file) VALUES (?, ?, ?)`, [username, projectId, filePath], (err, data) => {
        if (err) {
            console.error('Error inserting attachment:', err);
            return res.status(500).send('Error uploading file');
        }
        console.log('File uploaded successfully:', req.file);
        res.redirect(`/project/OverView/${projectId}`);
    });
}

const deleteAttachment = (req, res) => {
    const id = req.params.id;
    userModel.query(`DELETE FROM attachments WHERE id = ?`, [id], (err, result) => {
        if (err) {
            console.error('Error deleting attachment:', err);
            return res.status(500).send('Error deleting attachment');
        }
        console.log('Attachment deleted successfully');
    });
}

module.exports = {
    signup,
    login,
    deleteuser,
    userEditPost,
    userDeletePost,
    addProject,
    addComments,
    updateProject,
    deletProject,
    memberAdd,
    addTopic,
    addTask,
    addAttachment,
    deleteAttachment,
    deleteComments,
    udateCommit
}