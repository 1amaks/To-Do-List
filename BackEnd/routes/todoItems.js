const router = require('express').Router();
const todoItemsModel = require('../models/todoItems');

router.post('/api/item', async (req, res) => {
  try {
    const newItem = new todoItemsModel({
      item: req.body.item,
      dueDate: req.body.dueDate,
      taskDescription: req.body.taskDescription,
      completed: req.body.completed || false,
    });
    const saveItem = await newItem.save();
    res.status(200).json(saveItem);
  } catch (err) {
    res.json(err);
  }
});

router.get('/api/items', async (req, res) => {
  try {
    const allTodoItems = await todoItemsModel.find({});
    res.status(200).json(allTodoItems);
  } catch (err) {
    res.json(err);
  }
});

router.put('/api/item/:id', async (req, res) => {
  try {
    const updateItem = await todoItemsModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateItem);
  } catch (err) {
    res.json(err);
  }
});

router.delete('/api/item/:id', async (req, res) => {
  try {
    const deleteItem = await todoItemsModel.findByIdAndDelete(req.params.id);
    res.status(200).json('Item Deleted');
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
