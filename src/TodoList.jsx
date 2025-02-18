import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "./apiClient.js";

function TodoList({ setIsLoggedIn }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);
  const loggedInUserId = localStorage.getItem("userId");

  //Getting the name of the USER to display it as a Header
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  function Tooltip({ text, icon }) {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    return (
      <div
        className="tooltip-container"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        <span className="icon">{icon}</span>
        {isTooltipVisible && <span className="tooltip-text">{text}</span>}
      </div>
    );
  }

  /** function to getTasks from the DB, Get the Specific user's List using his ID*/
  async function getTasks() {
    const userId = localStorage.getItem("userId");
    setLoading(true);
    try {
      const response = await api.get("/todos", { params: { userId: userId } });
      const tasks = response.data;
      return tasks;
    } catch (err) {
      console.error("Error fetching data : ", err);
    } finally {
      setLoading(false);
    }
  }
  //Async function to display the Data in my list
  useEffect(() => {
    async function fetchTasks() {
      try {
        const fetchedTasks = await getTasks();
        if (fetchedTasks) {
          setTasks(fetchedTasks);
        }
      } catch (error) {
        console.error("Error in  component", error);
      }
    }
    fetchTasks();
  }, []);
  //Function that add tasks
  async function addTask() {
    setLoading(true);
    const newText = { text: newTask, completed: false, userId: loggedInUserId };
    if (newTask.trim() === "") {
      setLoading(false);
      return;
    }
    //Verification for duplication
    if (
      tasks.some((task) => task.text.toLowerCase() === newTask.toLowerCase())
    ) {
      console.error("Task already exist");
      window.alert("Task already exists !");
      setNewTask("");
      setLoading(false);
      return;
    }
    try {
      const response = await api.post("/todos", newText);
      const createdTask = response.data;
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setNewTask("");
    } catch (error) {
      console.error("Couldn't add Task : ", error);
    } finally {
      setLoading(false);
    }
  }

  //HandleINputChange function to enable the input to be written inside
  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };
  //Function that allow the checkbox to be selected
  const toggleComplete = async (id) => {
    try {
      const taskToUpdate = tasks.find((task) => task._id === id);
      const response = await api.patch(`/todos/${id}/complete`, {
        completed: !taskToUpdate.completed,
      });
      console.log(response.data);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id
            ? { ...task, completed: response.data.completed }
            : task
        )
      );
    } catch (error) {
      console.error("Error toggling complete:", error);
      alert(error.message); // Display the error message
    }
  };
  //Helper function to Count number of Selected tasks
  const getSelectedTaskCount = () => {
    return tasks.filter((task) => task.completed).length;
  };
  //Function that Clear all the selected Items
  const clearCompleted = async () => {
    const selectedCount = getSelectedTaskCount();
    try {
      if (selectedCount > 0) {
        const confirmed = window.confirm(
          `Are you sure you want to delete ${selectedCount} tasks?`
        );

        let response;
        if (confirmed) {
          response = await api.delete("/todos/completed");
        } else {
          return;
        }

        console.log(response.data); // Log the response data

        setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
      }
    } catch (error) {
      console.error("Error deleting completed tasks:", error);
      alert(error.message);
    }
  };

  //Function that Delete certain TASK
  const deleteTask = async (id) => {
    try {
      const response = await api.delete(`/todos/${id}`); // Use api.delete

      console.log(response.data); // Log the response data

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(error.message);
    }
  };

  //Function to Edit TASKS
  const editTask = async (id, newText) => {
    try {
      const response = await api.put(`/todos/${id}`, { text: newText });

      const updatedTask = response.data;

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error modifying a Task", error);
      alert(error.message); // Display the error message to the user
    }
  };
  /**Logout Function and Clearing LocalStorage */
  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await api.post("/users/logout", { userId });
      if (response.status === 200) {
        localStorage.removeItem("accessToken"); // Remove access token
        localStorage.removeItem("username"); // Remove username
        localStorage.removeItem("userId"); // Remove userId
        localStorage.removeItem("items"); //remove Tasks list
        setIsLoggedIn(false);
        navigate("/Login");
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <div className="app-container">
      <header>
        <h1>{username ? `Hello, ${username}!` : "Welcome!"}</h1>
      </header>
      <main>
        <ul className="task-list">
          {tasks.length === 0 && "No Tasks available"}

          {tasks.map((task) => (
            <li
              key={task._id}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              <input
                className="todo-checkbox"
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task._id)}
              />
              <span
                onDoubleClick={() => {
                  const newText = prompt("Edit the task", task.text);
                  if (newText !== null) {
                    editTask(task._id, newText);
                  }
                }}
              >
                {task.text}
              </span>
              <button
                className="delete-button"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <input
          className="new-task-input"
          type="text"
          value={newTask}
          onChange={handleInputChange}
          placeholder="Enter a task..."
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTask();
            }
          }}
        />
        <div className="button-container">
          {" "}
          <button
            className="add-todo-button"
            onClick={addTask}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add ToDo"}
          </button>
          <button className="clear-completed-button" onClick={clearCompleted}>
            Clear Completed ToDo
          </button>
        </div>
        <div className="tooltip">
          <Tooltip
            text="Double click on a task to modify it"
            icon={
              <span role="img" aria-label="Lightbulb">
                💡
              </span>
            }
          />
        </div>
        <button type="button" className="btn btn-dark" onClick={handleLogout}>
          Log out
        </button>
      </main>
    </div>
  );
}
TodoList.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired, //  setIsLoggedIn is a function and is required
};
export default TodoList;
