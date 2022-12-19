var express = require("express");
var router = express.Router();
const TaskModel = require("../models/taskModel");
const userModel = require("../models/userModel");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Hello");
  // res.render('index', { title: 'Express' });
});
router.get("/:id", (req, res) => {
  const { id } = req.params;
  userModel
    .findById(id)
    .select("userTasks")
    .then((response) => {
      response.populate("userTasks").then((response) => {
        res.json(response);
      });
    });
});
router.post("/addTask", (req, res) => {
  const { userId, taskString, taskDate } = req.body;
  let taskDateconverted = new Date(taskDate);
  let cDate = new Date();
  console.log(`Converted date is ${taskDateconverted.getTime()}`);
  console.log(`Converted date string is ${taskDateconverted.toLocaleString()}`);
  console.log(`Current date is ${cDate.toLocaleString()}`);
  userModel.findById(userId).then((response) => {
    let user = response;
    console.log(user);
    const newTask = new TaskModel({
      userId: userId,
      taskString: taskString,
      taskDate: taskDateconverted,
    });
    newTask.save().then((sresponse) => {
      let tarr = user.userTasks;
      console.log(user.userTasks);
      tarr.push(newTask._id);
      user.userTasks = tarr;
      user.save().then((response) => {
        user.populate({ path: "userTasks" }).then((response) => {
          console.log(response);
          res.json(response);
        });
      });
    });
  });
});
router.post("/editTask", (req, res) => {
  const { userId, taskId, updatedTaskString, updatedTaskDate } = req.body;
  let taskDateconverted = new Date(updatedTaskDate);
  console.log(req.body);
  userModel
    .findOne()
    .where("user")
    .equals(userId)
    .then((response) => {
      let user = response;
      console.log(user);
      let tarr = user.userTasks.map((element) => {
        if (element == taskId) {
          TaskModel.deleteOne().where("_id").equals(taskId);
          let upTask = new TaskModel({
            userId: userId,
            taskString: updatedTaskString,
            taskDate: taskDateconverted,
          });
          upTask.save();
          return upTask._id;
        }
        return element;
      });
      user.userTasks = tarr;
      user.save().then((response) => {
        user.populate("userTasks").then((response) => {
          res.json(response);
        });
      });
    });
});
router.post("/deleteTask", (req, res) => {
  const { user, taskId } = req.body;
  userModel.findById(user).then((response) => {
    let user = response;
    console.log(user);
    const tarr = user.userTasks.filter((ele) => ele != taskId);
    TaskModel.findByIdAndDelete(taskId);
    user.userTasks = tarr;
    user.save().then((response) => {
      response.populate("userTasks").then((r) => {
        res.json(r);
      });
    });
  });
});
module.exports = router;
