const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  owner: { 
    type: ObjectId,
    required: true,
    ref: "User", //DISABLED LINE:B
  }, 
},{
  timestamps : true
});

const Task = mongoose.model('Task',taskSchema)
module.exports = Task;
