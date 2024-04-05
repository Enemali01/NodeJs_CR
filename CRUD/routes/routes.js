import {User} from "../models/users.js";
import mongoose from "mongoose";
import fs from "fs";
import multer from "multer";
import {Router} from "express"
const route = Router();



// To upload images  cb stands for callback
let storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "./uploads");
  },
  filename: function(req, file, cb){
    cb(null, file.filename + "_" + Date.now() + "_" + file.originalname);
  },
});

let upload = multer({
  storage: storage,
}).single("image");


// Insert a user into the database 
route.post('/add', upload,  (req, res) =>{
  const new_user = new User ({
    name:  req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file.filename,
  });
    new_user.save()
    .then((user) => {
      if(user){
        req.session.message = {
        type: 'success',
        message: 'User added successfully'
       };
      }else{
        res.status(404).send({message: "Something wnet wrong tring to save"})
      }   
    })
    .catch((err)=> {
        res.json({message: err.message, type: 'danger'});
    })
    res.redirect('/');
});

// Gell all users record displayed
route.get('/', (req, res) => {
  User.find({})
    .then((users) => {
      res.render('index', {
        title: 'Home Page',
        users: users,
      })
      // .catch((err) => {
      //   res.render('index');
      // })
    });
  
});


route.get('/add', (req, res) => {
  res.render('add_users', {title: 'Add Users Page'});
});

// Edit user record route
route.get('/edit/:id', (req, res) => {
   let id = req.params.id;
    User.findById(id)
    .then(user => {
      if(user){
        res.render('edit_users', {
          title: "Edit User Record",
          user: user,
      });  
      }else{
        res.status(404).send({message: `Cannot update user with ${id}`})
      }
    })
    .catch(err => {
      res.status(500).send({message: "Error updating user"})
    })
});


// Update user record route
route.post('/update/:id', upload, (req, res) =>{
  let id = req.params.id;
  let new_image = null;
  if(req.file){
    new_image = req.file.filename;
    try{
      fs.unlinkSync('./uploads/', + req.body.old_image);
    }catch(err){
      console.log(err);
    }
  }else{
    new_image = req.body.image;
  }

  User.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: new_image,
  })
  .then(user => {
    if(user){
      req.session.message = {
        type: 'success',
        message: 'User updated successfully',
      };
      res.redirect('/');
    }else{
      res.json({message: err.message, type: 'danger'});
    }
  })
});


// Delete User Record
route.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  let result;
  
  User.findByIdAndDelete(id)
  .then((user) => {
    if(user){
      req.session.message = {
      type: 'danger',
      message: 'User Deleted Successfully'
    },
    
    res.redirect('/');
    if(result.image !== ""){
      try{
       fs.unlinkSync("./uploads/" + result.image);
       console.log(fs);
      }catch(err){
       console.log(err);
      }
    }
    }else{
      res.json({message: err.message, type: 'danger'});
    }
  })
  .catch((err) =>{
     console.log(err);
  })
});


export default route;