const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const taskSchema = new Schema ({
    userId: {
        type:Schema.Types.ObjectId,
        required:true
    },
    taskString: {
        type:String,
    },
    taskDate:{
        type:Date,
        min:Date.now //can't have tasks to the past
    }
}
);
const taskModel = mongoose.model("tasks" , taskSchema);
module.exports = taskModel;