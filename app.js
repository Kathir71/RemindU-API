var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mailerfunc = require("./nodemailer");
const taskModel = require("./models/taskModel");
const userModel = require("./models/userModel");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
mongoose.connect(process.env.DB);
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use("/", indexRouter);
app.use("/user", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.listen(process.env.PORT, () => {
  console.log("hello");
});
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
const sendMails = () => {
  taskModel.find({}).then((response) => {
    const allTasks = response;
    let cDateTime = new Date().toLocaleString();
    cDateTime = cDateTime.slice(0, cDateTime.lastIndexOf(":"));
    allTasks.forEach((element) => {
      let taskDateTime = element.taskDate.toLocaleString();
      taskDateTime = taskDateTime.slice(0, taskDateTime.lastIndexOf(":"));
      if (taskDateTime === cDateTime) {
        const userId = element.userId;
        userModel
          .findById(userId)
          .select("userEmail")
          .then((response) => {
            console.log("Task date time matched , Sending the mail");
            const userEmail = response.userEmail;
            mailerfunc({taskString:element.taskString , userEmail:userEmail});
          });
      }
    });
  });
};
const mailDaemon = () => setInterval(sendMails, 60000);
mailDaemon();
module.exports = app;
