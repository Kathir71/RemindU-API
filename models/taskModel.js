const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const taskSchema = new Schema (
    {
    user:{
        type:Schema.Types.ObjectId,
        required:true
    },
    tasks: {
        type:[String]
    }
    
}
);
const taskModel = mongoose.model("tasks" , taskSchema);
module.exports = taskModel;