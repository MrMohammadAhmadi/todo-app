const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const todoControllers = require("../controllers/todoControllers");

router.get("/", todoControllers.fetchTodoList);

router.put(
  "/update/:todoId",
  [check("title").trim().not().isEmpty()],
  todoControllers.updateOneTodo
);

router.post(
  "/add",
  [check("title").trim().not().isEmpty()],
  todoControllers.addTodo
);

router.delete("/:todoId", todoControllers.deleteOneTodo);

module.exports = router;
