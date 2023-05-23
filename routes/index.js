var express = require("express");
var router = express.Router();
const TaskModel = require("../models/taskModel");
const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");
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
  userModel.findById(userId).then((response) => {
    let user = response;
    const newTask = new TaskModel({
      userId: userId,
      taskString: taskString,
      taskDate: taskDate,
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
  const user = await userModel.findById(userId);
  const task = await taskModel.findById(taskId);
  await taskModel.deleteOne().where("_id").equals(taskId);
  const newTask = new taskModel({
    userId: userId,
    taskString: updatedTaskString,
    taskDate: updatedTaskDate,
  });
  const newSavedTask = await newTask.save();
  const tarr = user.userTasks.map((element) => {
    if (element == taskId) {
      return newSavedTask._id;
    } else {
      return element;
    }
  });
  user.userTasks = tarr;
      console.log(tarr);
      user.save().then((response) => {
        user.populate("userTasks").then((response) => {
          res.json(response);
        }).catch((err) => {
          res.status(415).json(err.message);
        })
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