import React from "react";
import "./TaskItem.css";

const TaskItem = (props) => {
  return (
    <div className="item">
      <div className="row">
        <div className="col-1">
          <input
            type="checkbox"
            checked={props.item.checked}
            onChange={props.checkItemHandler.bind(this, props.item.id)}
          />
        </div>
        <div className="col-9 text-left ">
          <p>{props.item.title}</p>
        </div>
        <div className="col-2">
          <ul>
            <li>
              <img
                src="./assets/img/iconfinder_General_Office_24_3592821.png"
                onClick={(e) => props.deleteItemHandler(e, props.item.id)}
                alt="remove icon"
              />
            </li>
            <li>
              <img
                src="./assets/img/iconfinder_General_Office_10_3592815.png"
                onClick={(e) => props.editItemHandler(e, props.item.id)}
                alt="edit icon"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
