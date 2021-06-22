const express = require("express");

require("./db/mongoose");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const categoryRouter = require("./routers/category");

const app = express();

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);
app.use(categoryRouter);

module.exports = app;
