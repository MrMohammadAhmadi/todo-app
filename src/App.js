import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React from "react";
import TaskList from "./components/TaskList";
import "./App.css";

const App = () => {
  return (
    <div className="App ">
      <TaskList />
    </div>
  );
};

export default App;
