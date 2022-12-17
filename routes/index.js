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
  TaskModel.find()
    .where("user")
    .equals(id)
    .select("tasks")
    .then((response) => {
      res.json(response);
    });
});
router.post("/addTask", (req, res) => {
  const { userId, taskString } = req.body;
  console.log(taskString);
  TaskModel.find({ user: userId }, (err, results) => {
    console.log(results.length);
    if (results.length == 0) {
      let tarr = [taskString];
      const firstTask = new TaskModel({ user: userId, tasks: ["mytask"] });
      firstTask.save(() => {
        console.log("Saved Sucessfully");
      });
    } else {
      console.log(results);
      let tarr = [...results[0].tasks, taskString];
      TaskModel.updateOne({ user: userId }, { $set: { tasks: tarr } }).then(
        (response) => {
          console.log("updated successfully");
        }
      );
    }
    res.send("Addition successfull");
  });
});
router.post("/editTask", (req, res) => {
  const { userId, oldTask, updatedTask } = req.body;
  TaskModel.find()
    .where("user")
    .equals(userId)
    .then((response) => {
      let user = response[0];
      console.log(user);
      let tarr = user.tasks.map((str) => {
        if (str !== oldTask) return str;
        else return updatedTask;
      });
      user.tasks = tarr;
      user.save();
      res.json(user);
    });
});
router.post("/deleteTask" , (req,res) => {
  const {user , targetTask} = req.body;
  TaskModel.find()
  .where("user")
  .equals(user).then((response) => {
    let user = response[0];
    let tarr = user.tasks.filter((str) => str !== targetTask);
    user.tasks = tarr;
    user.save();
    res.json(user);
  })

})
module.exports = router;
