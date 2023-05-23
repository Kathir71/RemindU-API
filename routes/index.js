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
  const currentDate = new Date();
const timezoneOffsetInMinutes = currentDate.getTimezoneOffset();
const adjustedDate = new Date(currentDate.getTime() - (timezoneOffsetInMinutes * 60000));
  taskDateconverted = new Date(taskDateconverted.getTime() - (timezoneOffsetInMinutes * 60000));
  let cDate = new Date();
  userModel.findById(userId).then((response) => {
    let user = response;
    const newTask = new TaskModel({
      userId: userId,
      taskString: taskString,
      taskDate: taskDateconverted,
    });
    newTask.save().then((sresponse) => {
      let tarr = user.userTasks;
      tarr.push(newTask._id);
      user.userTasks = tarr;
      user.save().then((response) => {
        user.populate({ path: "userTasks" }).then((response) => {
          res.json(response);
        });
      });
    }).catch((err) => {
      res.status(415).json(err.message);
    })
  });
});
router.post("/editTask", async(req, res) => {
  const { userId, taskId, updatedTaskString, updatedTaskDate } = req.body;
  let taskDateconverted = new Date(updatedTaskDate);
 const currentDate = new Date(updatedTaskDate);
const timezoneOffsetInMinutes = currentDate.getTimezoneOffset();
const adjustedDate = new Date(currentDate.getTime() - (timezoneOffsetInMinutes * 60000));
  taskDateconverted = adjustedDate;
  
  userModel
    .findOne()
    .where("user")
    .equals(userId)
    .then((response) => {
      let user = response;
      let tarr = user.userTasks.map(async(element) => {
        if (element == taskId) {
          await TaskModel.deleteOne().where("_id").equals(taskId);
          let upTask = new TaskModel({
            userId: userId,
            taskString: updatedTaskString,
            taskDate: taskDateconverted,
          });
          await upTask.save();
          return upTask._id;
        }
        return element;
      });
      user.userTasks = tarr;
      user.save().then((response) => {
        user.populate("userTasks").then((response) => {
          res.json(response);
        }).catch((err) => {
          res.status(415).json(err.message);
        })
      });
    });
});
router.post("/deleteTask", (req, res) => {
  const { user, taskId } = req.body;
  userModel.findById(user).then(async(response) => {
    let user = response;
    const tarr = user.userTasks.filter((ele) => ele != taskId);
    await TaskModel.findByIdAndDelete(taskId);
    user.userTasks = tarr;
    user.save().then((response) => {
      response.populate("userTasks").then((r) => {
        res.json(r);
      });
    });
  });
});
module.exports = router;