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
  user.save().then((response) => {
    res.send(response);
  }).catch((err) => {
    res.status(415).send(err.message);
  })
})
router.post("/login" , (req , res) => {
  const {userEmail , userPassword} = req.body;
  userModel.find().where("userEmail").equals(userEmail).where("userPassword").equals(userPassword).select("_id").then((response) => {
    if ( response.length == 0){
      res.status(415).send("Invalid");
    }
    else {
      res.send(response)
    }
  })
})

module.exports = router;
