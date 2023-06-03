import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [itemText, setItemText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');
  const [updateDueDate, setUpdateDueDate] = useState('');
  const [updateTaskDescription, setUpdateTaskDescription] = useState('');


  const toggleCompleted = async (id, completed) => {
    try {
      await axios.put(`http://localhost:5500/api/item/${id}`, {
        completed: !completed,
      });
      const updatedItems = listItems.map((item) => {
        if (item._id === id) {
          return {
            ...item,
            completed: !completed,
          };
        }
        return item;
      });
      setListItems(updatedItems);
    } catch (err) {
      console.log(err);
    }
  };

  // Add new todo item to database
  const addItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5500/api/item', {
        item: itemText,
        dueDate: dueDate,
        taskDescription: taskDescription,
        completed: false,
      });
      setListItems((prev) => [...prev, res.data]);
      setItemText('');
      setDueDate('');
      setTaskDescription('');
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch all todo items from database
  useEffect(() => {
    const getItemsList = async () => {
      try {
        const res = await axios.get('http://localhost:5500/api/items');
        setListItems(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getItemsList();
  }, []);

  // Delete item when clicked on delete
  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5500/api/item/${id}`);
      const newListItems = listItems.filter((item) => item._id !== id);
      setListItems(newListItems);
    } catch (err) {
      console.log(err);
    }
  };

  // Update item
  const updateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5500/api/item/${isUpdating}`, {
        item: updateItemText || listItems.find(item => item._id === isUpdating).item,
        dueDate: updateDueDate || listItems.find(item => item._id === isUpdating).dueDate,
        taskDescription: updateTaskDescription || listItems.find(item => item._id === isUpdating).taskDescription,
      });
      const updatedItems = listItems.map((item) => {
        if (item._id === isUpdating) {
          return {
            ...item,
            item: updateItemText || item.item,
            dueDate: updateDueDate || item.dueDate,
            taskDescription: updateTaskDescription || item.taskDescription,
          };
        }
        return item;
      });
      setListItems(updatedItems);
      setUpdateItemText('');
      setUpdateDueDate('');
      setUpdateTaskDescription('');
      setIsUpdating('');
    } catch (err) {
      console.log(err);
    }
  };

  const cancelUpdate = () => {
    setUpdateItemText('');
    setUpdateDueDate('');
    setUpdateTaskDescription('');
    setIsUpdating('');
  };



  // Before updating item, show input fields for the updated item
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e) => updateItem(e)}>
      <div className='taskCard'>
        <div className='top-row'>
          <span className="item-content"><input
            className="update-item-content"
            type="text"
            placeholder="New Title"
            onChange={(e) => setUpdateItemText(e.target.value)}
            value={updateItemText || listItems.find(item => item._id === isUpdating).item}
          /></span>
          <span className="item-due-date"><input
            className="update-item-due-date"
            type="date"
            placeholder="New Due Date"
            onChange={(e) => setUpdateDueDate(e.target.value)}
            value={updateDueDate || listItems.find(item => item._id === isUpdating).dueDate}
          />
          </span>
        </div>
        <div className='top-row'>
          <span className="item-description"><input
            className="update-item-description"
            type="text"
            placeholder="New Task Description"
            onChange={(e) => setUpdateTaskDescription(e.target.value)}
            value={updateTaskDescription || listItems.find(item => item._id === isUpdating).taskDescription}
          /></span>
          <div className='button-group'>
            <button className="AddTask update-item" type="submit">Update</button>
            <button className="AddTask delete-item" onClick={() => cancelUpdate()}>Cancel</button>
          </div>
        </div>

      </div>
      <hr />








    </form>
  );




  return (
    <div className="main">
      <div className="home">
        <h1>Todo List</h1>
        <form className="form" onSubmit={(e) => addItem(e)}>
          <div class="form__group field">
            <input type="input"
              className="form__field"
              placeholder="Title"
              name="title" id='title'
              onChange={(e) => setItemText(e.target.value)}
              value={itemText} required
            />
            <label for="title" class="form__label">Add a Task</label>
          </div>

          <div class="form__group field">
            <input type="input"
              className="form__field"
              placeholder="Task Desciption"
              name="description" id='description'
              onChange={(e) => setTaskDescription(e.target.value)}
              value={taskDescription} required
            />
            <label for="description" class="form__label">Task Desciption</label>
          </div>

          <div class="form__group field DateAdd">
            <input type="date"
              className="form__field date"
              placeholder="Due Date"
              name="dueDate" id='dueDate'
              onChange={(e) => setDueDate(e.target.value)}
              value={dueDate} required
            />
            <label for="dueDate" class="form__label">Due Date</label>
            <button className='AddTask' type="submit">Add</button>
          </div>
        </form>
      </div>


      <h2>Tasks</h2>
      <div className="todo-listItems">
        {listItems.map((item) => (
          <div className="todo-item" key={item._id}>
            {isUpdating === item._id ? (
              renderUpdateForm()
            ) : (
              <>
                <div className='taskCard'>
                  <div className='top-row'>
                    <li><span className="item-content">{item.item}</span></li>
                    <span className="item-due-date">{item.dueDate}
                      <input className="chkbx" type="checkbox" id="myCheckbox" checked={item.completed} onChange={() => toggleCompleted(item._id, item.completed)} />
                      <label className="checkbox-label" for="myCheckbox">Mark as Done</label>
                    </span>
                  </div>
                  <div className='top-row'>
                    <p className="item-description">{item.taskDescription}</p>
                    <div className='button-group'>
                      <button className="AddTask update-item" onClick={() => setIsUpdating(item._id)}>Update</button>
                      <button className="AddTask delete-item" onClick={() => deleteItem(item._id)}>Delete</button>
                    </div>
                  </div>

                </div>
                <hr />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
