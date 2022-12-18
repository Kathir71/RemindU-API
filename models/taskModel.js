const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const taskSchema = new Schema (
    {
    taskString: {
        type:String,
    },
    taskDate:Date,
}
);
const taskModel = mongoose.model("tasks" , taskSchema);
module.exports = taskModel;