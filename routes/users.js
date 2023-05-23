var express = require("express");
var router = express.Router();
const cors = require("cors");
router.use(cors());
const userModel = require("../models/userModel");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/signup", (req, res) => {
  const { username, useremail, userpasswd } = req.body;
  const user = new userModel({
    userName: username,
    userEmail: useremail,
    userPassword: userpasswd,
  });
  user
    .save()
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.status(415).send(err.message);
    });
});
router.post("/login", (req, res) => {
  const { userEmail, userPassword } = req.body;
  userModel
    .find()
    .where("userEmail")
    .equals(userEmail)
    .where("userPassword")
    .equals(userPassword)
    .select("_id")
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.status(567).send(err.message);
    });
});

module.exports = router;
