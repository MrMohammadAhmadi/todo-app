import React, { useState, useEffect, useReducer } from "react";
import $ from "jquery";
import axios from "axios";
import TaskItem from "./TaskItem";
import "./TaskList.css";

const taskListReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];
    case "SET":
      return action.payload;
    case "DELETE":
      return state.filter((item) => item.id !== action.payload);
    case "REPLACE":
      return state.map((a) => {
        var returnValue = { ...a };

        if (a.id === action.id) {
          returnValue = action.payload;
        }
        return returnValue;
      });
    default:
      return state;
  }
};
const TaskList = () => {
  const [inputVal, setInputVal] = useState("");
  const [updateInfo, setUpdateInfo] = useState({
    id: "",
    situation: false,
  });
  const [taskList, dispatch] = useReducer(taskListReducer, []);

  useEffect(() => {
    getTodoList();
  }, []);
  const getTodoList = async () => {
    try {
      axios.get("http://localhost:5000/api/todo/").then((res) => {
        if (res.status === 200) {
          dispatch({ type: "SET", payload: res.data.todoList });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  const addToTaskList = async (e) => {
    e.preventDefault();
    if (updateInfo.situation === true) {
      const taskItem = taskList.find((item) => item.id === updateInfo.id);
      await updateInDB(taskItem.id, {
        title: inputVal,
        checked: taskItem.checked,
      });
      setUpdateInfo({
        id: "",
        situation: false,
      });
    } else {
      const newTask = { title: inputVal };
      axios
        .post("http://localhost:5000/api/todo/add", newTask)
        .then((res) => {
          if (res.status === 201) {
            dispatch({ type: "ADD", payload: res.data.result });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setInputVal("");
    $(".collapse").collapse("hide");
  };
  const deleteItemHandler = (e, itemId) => {
    axios.delete(`http://localhost:5000/api/todo/${itemId}`).then((res) => {
      if (res.status === 200) {
        dispatch({ type: "DELETE", payload: itemId });
      }
    });
  };
  const checkItemHandler = (itemId) => {
    const taskItem = taskList.find((item) => item.id === itemId);
    const update = {
      title: taskItem.title,
      checked: !taskItem.checked,
    };
    updateInDB(itemId, update);
  };
  const editItemHandler = (e, itemId) => {
    $(".collapse").collapse("show");
    const taskItem = taskList.find((item) => item.id === itemId);
    setInputVal(taskItem.title);
    setUpdateInfo((preState) => ({
      id: itemId,
      situation: true,
    }));
  };
  const changeInputHandler = (e) => {
    setInputVal(e.target.value);
  };
  const updateInDB = (itemId, update) => {
    axios
      .put(`http://localhost:5000/api/todo/update/${itemId}`, update)
      .then((res) => {
        if (res.status === 201) {
          console.log(res.data.result);
          dispatch({ type: "REPLACE", id: itemId, payload: res.data.result });
        }
      });
  };
  return (
    <div className="TaskList">
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header col-md-12 d-flex justify-content-between">
            <a className="navbar-brand" href="#myPage">
              Todo List
            </a>
            <button
              type="button"
              className="navbar-toggle"
              data-toggle="collapse"
              data-target="#myNavbar"
            >
              <span className="icon-bar">Add new Task</span>
            </button>
          </div>
          <div className="collapse navbar-collapse" id="myNavbar">
            <form onSubmit={addToTaskList}>
              <input
                value={inputVal}
                onChange={changeInputHandler}
                id="addTaskInput"
                placeholder="Enter new task"
              />
              <button>+</button>
            </form>
          </div>
        </div>
      </nav>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 m-auto">
            {taskList.length > 0 &&
              taskList.map((item) => {
                return (
                  <TaskItem
                    item={item}
                    key={item.id}
                    checkItemHandler={checkItemHandler}
                    deleteItemHandler={deleteItemHandler}
                    editItemHandler={editItemHandler}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
