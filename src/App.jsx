import "./App.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTrash,
  faEdit,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  const [textInput, setTextInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [uncompletedTasks, setUncompletedTask] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("All");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [light, setLight] = useState(false)

  const lightMode = () => {
    const body = document.body;
  
    if (light === true) {
      body.style.background = 'linear-gradient(40deg, rgb(52, 0, 0), rgb(14, 13, 47), rgb(77, 0, 0)'
    } else {
      body.style.background = 'linear-gradient(40deg, rgb(0, 98, 168), rgb(33, 33, 59), rgb(255, 175, 235)'
      
    }

    setLight(!light);
  };

  console.log(light)

  const handleChange = (event) => {
    const value = event.target.value;
    setTextInput(value);
  };

  const filteredTasks =
    currentFilter === "Completed"
      ? completedTasks
      : currentFilter === "Uncompleted"
      ? uncompletedTasks
      : tasks;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (textInput) {
      setTasks([
        ...tasks,
        { task: textInput, completed: false, id: crypto.randomUUID() },
      ]);

      setUncompletedTask([
        ...tasks,
        { task: textInput, completed: false, id: crypto.randomUUID() },
      ]);
    }

    setTextInput("");
  };

  const deleteAll = (e) => {
    e.preventDefault();
    setTasks([]);
    setUncompletedTask([]);
    setCompletedTasks([]);
  };

  const checkDone = (event) => {
    const liElement = event.target.closest(".task-list");
    const liID = liElement.getAttribute("id");

    const updatedTasks = tasks.map((task) => {
      if (task.id === liID) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    setTasks(updatedTasks);
    setUncompletedTask(updatedTasks);
  };

  const deleteTask = (taskID) => {
    const updateDelete = filteredTasks.filter((del) => del.id !== taskID);
    setTasks(updateDelete);
    setUncompletedTask(updateDelete);
    setCompletedTasks(updateDelete);
  };

  const taskCompleted = () => {
    const completed = tasks.filter((task) => task.completed === true);
    setCompletedTasks(completed);
    setCurrentFilter("Completed");
  };

  const taskUncompleted = () => {
    const uncompleted = tasks.filter((task) => task.completed === false);
    setUncompletedTask(uncompleted);
    setCurrentFilter("Uncompleted");
  };

  const showAllTasks = () => {
    setCompletedTasks([]);
    setUncompletedTask([]);
    setCurrentFilter("All");
  };

  const editTask = (taskId, taskText) => {
    setEditingTaskId(taskId);
    setNewTaskText(taskText);
  };

  const saveEditedTask = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId && newTaskText !== "") {
        return { ...task, task: newTaskText };
      }
      return task;
    });
    setTasks(updatedTasks);
    setUncompletedTask(updatedTasks);
    setCompletedTasks(updatedTasks);
    setEditingTaskId(null);
    setNewTaskText("");
  };

  const editPallete = (taskID) => {
    const liElement = document.getElementById(taskID);
    const colorPalette = document.createElement("div");
    colorPalette.className = "color-palette";

    const colors = [
      "red",
      "blue",
      "green",
      "yellow",
      "orange",
      "pink",
      "purple",
      "brown",
      "gray",
    ];

    colors.forEach((color) => {
      const colorOption = document.createElement("div");
      colorOption.className = "color-option";
      colorOption.style.backgroundColor = color;

      colorOption.addEventListener("click", () => {
        liElement.style.backgroundColor = color;
        colorPalette.remove();
      });

      colorPalette.appendChild(colorOption);
    });

    const liRect = liElement.getBoundingClientRect();
    colorPalette.style.top = `${liRect.top + window.scrollY}px`; // Alinea la parte superior con el li
    colorPalette.style.left = `${liRect.right + window.scrollX}px`;

    liElement.parentNode.appendChild(colorPalette, liElement);
  };

  return (
    <div>
      <label className="switch">
          <input type="checkbox"/>
          <span className="darkMode" onClick={lightMode}></span>
        </label>
      <form className="container" onClick={(e) => e.preventDefault()}>
        
        <h1>TodoApp</h1>
        <div className="manage">
          {editingTaskId === null ? (
            <input
              type="text"
              id="task-input"
              name="task"
              value={textInput}
              onChange={handleChange}
              placeholder="Drink water..."
              autoComplete="off"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={newTaskText}
              autoFocus
              onChange={(e) => setNewTaskText(e.target.value)}
            />
          )}
          {editingTaskId === null ? (
            <button type="submit" onClick={handleSubmit}>
              Add
            </button>
          ) : (
            <button
              style={
                editingTaskId !== null
                  ? { backgroundColor: "green" }
                  : { backgroundColor: "inherit" }
              }
              onClick={() => saveEditedTask(editingTaskId)}
            >
              Save
            </button>
          )}
        </div>
        <div className="filter">
          <button onClick={showAllTasks}>All</button>
          <button onClick={taskCompleted}>Completed</button>
          <button onClick={taskUncompleted}>Uncompleted</button>
        </div>
        <div className="task">
          {filteredTasks.length === 0 ? (
            <h1>Your list task is empty...</h1>
          ) : (
            filteredTasks.map((task) => (
              <li
                key={task.id}
                className="task-list"
                id={task.id}
                style={{
                  textDecorationLine: task.completed ? "line-through" : "none",
                }}
              >
                {task.task}
                <span className="buttons-tasks">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="done"
                    onClick={checkDone}
                  ></FontAwesomeIcon>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="edit"
                    onClick={() => editTask(task.id, task.task)}
                  ></FontAwesomeIcon>
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="trash"
                    onClick={() => deleteTask(task.id)}
                  ></FontAwesomeIcon>
                  <FontAwesomeIcon
                    icon={faPalette}
                    onClick={() => editPallete(task.id)}
                    className="palette"
                  ></FontAwesomeIcon>
                </span>
              </li>
            ))
          )}
          {tasks.length < 3 ? (
            ""
          ) : (
            <button className="delete-all" onClick={deleteAll}>
              Delete All
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default App;
