const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Todo = require("../models/todo");

const fetchTodoList = async (req, res, next) => {
  let todo;
  try {
    todo = await Todo.find();
  } catch (err) {
    const error = new HttpError("can't fetch from db.", 500);
    return next(error);
  }
  if (!todo) {
    const error = new HttpError("Not Exist.", 500);
    return next(error);
  }
  res.status(200).json({
    todoList: todo.map((item) => item.toObject({ getters: true })),
  });
};

const updateOneTodo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { title, checked } = req.body;
  const filter = { _id: req.params.todoId };
  const update = { title: title, checked: checked };

  let updatedTodo = await Todo.findOneAndUpdate(filter, update, {
    new: true,
  });

  res.status(201).json({ result: updatedTodo.toObject({ getters: true }) });
};

const addTodo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { title } = req.body;

  const newTodo = new Todo({
    title: title,
    checked: false,
  });

  try {
    await newTodo.save();
  } catch (err) {
    const error = new HttpError("server error", 500);
    return next(error);
  }
  res.status(201).json({ result: newTodo.toObject({ getters: true }) });
};

const deleteOneTodo = async (req, res, next) => {
  const todoId = req.params.todoId;
  let todo;
  try {
    todo = await Todo.findById(todoId);
  } catch (err) {
    const error = new HttpError("couldn't delete request", 500);
    return next(error);
  }
  try {
    await todo.remove();
  } catch (err) {
    const error = new HttpError("couldn't delete request", 500);
    return next(error);
  }

  res.status(200).json({ result: "todo item deleted" });
};

exports.fetchTodoList = fetchTodoList;
exports.updateOneTodo = updateOneTodo;
exports.addTodo = addTodo;
exports.deleteOneTodo = deleteOneTodo;
