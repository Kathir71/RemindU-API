var express = require('express');
var router = express.Router();
const cors = require('cors');
router.use(cors());
const userModel = require('../models/userModel');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post("/signup" , (req , res) => {
  const {username , useremail , userpasswd} = req.body;
  console.log(username);
  console.log(useremail);
  const user = new userModel({userName:username , userEmail:useremail , userPassword:userpasswd});
  user.save((err) => {
    console.log(err);
  })
  res.send("Successfull");
})

module.exports = router;
