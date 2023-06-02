const mongoose = require('mongoose');

const TodoItemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  dueDate: {
    type: String,
    required: true
  },
  taskDescription: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('TodoItem', TodoItemSchema);
