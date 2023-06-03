import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import './App.css';

import logo from './images/logo192.png';

function App() {
  const [itemText, setItemText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');
  const [updateDueDate, setUpdateDueDate] = useState('');
  const [updateTaskDescription, setUpdateTaskDescription] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  // Add new todo item to database
  const addItem = async (e) => {
    e.preventDefault();

    const trimmedItemText = itemText.trim();
    const trimmedDueDate = dueDate.trim();
    const trimmedTaskDescription = taskDescription.trim();

    if (!trimmedItemText || !trimmedDueDate || !trimmedTaskDescription) {
      alert('Please fill in all the fields');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5500/api/item', {
        item: trimmedItemText,
        dueDate: trimmedDueDate,
        taskDescription: trimmedTaskDescription,
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
        item: updateItemText || listItems.find((item) => item._id === isUpdating).item,
        dueDate: updateDueDate || listItems.find((item) => item._id === isUpdating).dueDate,
        taskDescription:
          updateTaskDescription || listItems.find((item) => item._id === isUpdating).taskDescription,
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

  const cancelUpdate = () => {
    setUpdateItemText('');
    setUpdateDueDate('');
    setUpdateTaskDescription('');
    setIsUpdating('');
  };

  // Before updating item, show input fields for the updated item
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e) => updateItem(e)}>
      <div className="taskCard">
        <div className="top-row">
          <span className="item-content">
            <input
              className="update-item-content"
              type="text"
              placeholder="New Title"
              onChange={(e) => setUpdateItemText(e.target.value)}
              value={updateItemText || listItems.find((item) => item._id === isUpdating).item}
            />
          </span>
          <span className="item-due-date">
            <input
              className="update-item-due-date"
              type="date"
              placeholder="New Due Date"
              onChange={(e) => setUpdateDueDate(e.target.value)}
              value={updateDueDate || listItems.find((item) => item._id === isUpdating).dueDate}
            />
          </span>
        </div>
        <div className="top-row">
          <span className="item-description">
            <input
              className="update-item-description"
              type="text"
              placeholder="New Task Description"
              onChange={(e) => setUpdateTaskDescription(e.target.value)}
              value={
                updateTaskDescription || listItems.find((item) => item._id === isUpdating).taskDescription
              }
            />
          </span>
          <div className="button-group">
            <button className="AddTask update-item" type="submit">
              Update
            </button>
            <button className="AddTask delete-item" onClick={() => cancelUpdate()}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <hr />
    </form>
  );

  // Sort the list based on the selected option
  const sortList = (option) => {
    let sortedItems = [...listItems];
    if (option === 'date') {
      sortedItems.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (option === 'status') {
      sortedItems.sort((a, b) => {
        if (a.completed && !b.completed) {
          return -1; // a comes before b
        } else if (!a.completed && b.completed) {
          return 1; // b comes before a
        }
        return 0; // no change in order
      });
    }

    // Set the default sorting order when the "default" option is selected
    if (option === 'default') {
      window.location.reload();
    }

    setListItems(sortedItems);
    setSortBy(option);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(listItems.length / itemsPerPage);


  return (
    <div className="main">
      <div className="home">
        <div className='Top'>
          <img className='top-logo' src={logo} alt=''></img>
          <h1>Todo List</h1>
        </div>
        <form className="form" onSubmit={(e) => addItem(e)}>
          <div class="form__group field">
            <input type="input"
              className="form__field"
              placeholder="Title"
              name="title" id='title'
              onChange={(e) => setItemText(e.target.value)}
              value={itemText} required
            />
            <label for="title" className="form__label">Add a Task</label>
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
              placeholder="DD-MM-YYYY"
              name="dueDate" id='dueDate'
              onChange={(e) => setDueDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              value={dueDate} required
            />
            <label htmlFor="dueDate" className="form__label">Due Date</label>
            <button className='AddTask add' type="submit">Add Task</button>
          </div>
        </form>
      </div>

      <div className="nav-div">
        <h2>Tasks</h2>

        <div className="sortBy">
          <label htmlFor="sortBy">Sort by:</label>
          <select
            id="sortBy"
            name="sortBy"
            value={sortBy}
            onChange={(e) => sortList(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="date">Date</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      <div className="todo-listItems">
        {currentItems.map((item) => (
          <div className="todo-item" key={item._id}>
            {isUpdating === item._id ? (
              renderUpdateForm()
            ) : (
              <>
                <div className={`taskCard ${item.completed ? 'completed' : ''}`}>
                  <div className="top-row">
                    <li>
                      <span className={`item-content ${item.completed ? 'completed' : ''}`}>
                        {item.item}
                      </span>
                    </li>
                    <span className="item-due-date">
                      {format(new Date(item.dueDate), 'dd-MMM-yy')}
                      <input className="chkbx"
                        type="checkbox"
                        id="myCheckbox"
                        checked={item.completed}
                        onChange={() => toggleCompleted(item._id, item.completed)}
                      />
                      <label className="checkbox-label" htmlFor="myCheckbox">
                        Mark as Done
                      </label>
                    </span>
                  </div>
                  <div className="top-row">
                    <p className={`item-description ${item.completed ? 'completed' : ''}`}>
                      {item.taskDescription}
                    </p>
                    <div className="button-group">
                      <button className="AddTask update-item" onClick={() => setIsUpdating(item._id)}>
                        Update
                      </button>
                      <button className="AddTask delete-item" onClick={() => deleteItem(item._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                <hr />
              </>
            )}
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button key={page} className={currentPage === page ? 'active' : ''} onClick={() => paginate(page)}>{page}</button>
        ))}
      </div>
    </div>
  );
}

export default App;
