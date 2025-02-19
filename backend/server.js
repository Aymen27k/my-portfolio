require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Todo = require("./models/Todo");
const connectDB = require("./models/connectDB");
const authMiddleware = require("./authMiddleware");
const User = require("./models/Users");
const app = express();
const port = 3000;

app.use(express.json()); //Enable parsing JSON request bodies

//DataBase connection
connectDB();

//API Routes
//Route to Display all tasks
app.get("/todos", authMiddleware, async (req, res) => {
  const userId = req.query.userId;
  try {
    const todos = await Todo.find({ userId: userId });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//Adding tasks
app.post("/todos", authMiddleware, async (req, res) => {
  try {
    const { text, userId } = req.body;
    const existingTodo = await Todo.findOne({
      text: { $regex: new RegExp(`^${text}$`, "i") },
      userId: User._id,
    });
    if (existingTodo) {
      return res.status(400).json({ message: "Task already exists!" });
    }
    const newTodo = new Todo({ text, userId });
    const todo = await newTodo.save();
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//to Switch completed to false & true
app.patch("/todos/:id/complete", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;

    try {
      const objectId = new mongoose.Types.ObjectId(taskId); // Convert to ObjectId
      const { completed } = req.body;

      const updatedTodo = await Todo.findByIdAndUpdate(
        objectId,
        { completed },
        { new: true, runValidators: true }
      );

      if (!updatedTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      res.json(updatedTodo);
    } catch (conversionError) {
      console.error("ObjectId conversion error:", conversionError);
      return res.status(400).json({ message: "Invalid Todo ID" }); // Send 400 for bad ID
    }
  } catch (err) {
    console.error("6. Error in PUT route:", err);
    res.status(500).json({ error: err.message || "Server Error" });
  }
});
//EDIT a task
app.put("/todos/:id", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;
    const updatedTextFromRequest = req.body.text;
    const objectId = new mongoose.Types.ObjectId(taskId);
    const updatedTodo = await Todo.findByIdAndUpdate(
      objectId,
      { $set: { text: updatedTextFromRequest } },
      { new: true, runValidators: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" }); // Handle not found
    }
    res.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Server error" });
  }
});
//To delete all Completed tasks
app.delete("/todos/completed", authMiddleware, async (req, res) => {
  try {
    const result = await Todo.deleteMany({ completed: true });
    if (!result) {
      return res.status(404).json({ msg: "Todo not found" });
    }
    res.json({ message: `${result.deletedCount} completed tasks deleted` });
  } catch (err) {
    console.error("Error deleting tasks", err);
    res.status(500).send("Server Error");
  }
});
//To delete a single task
app.delete("/todos/:id", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;
    const objectId = new mongoose.Types.ObjectId(taskId);
    const deletedTodo = await Todo.findByIdAndDelete(objectId);
    if (!deletedTodo) {
      return res.status(400).json({ message: "Todo Not found !" });
    }
    res.json({ message: "Task Deleted !" });
  } catch (err) {
    console.error("Error deleting task ", err);
    res.status(500).json({ error: "Server Error !" });
  }
});

/*
//ReOrdering Tasks
app.patch("/todos/reorder", async (req, res) => {
  try {
    const orderedTasks = req.body;
    if (!Array.isArray(orderedTasks)) {
      return res
        .status(400)
        .json({ error: "Invalid request body: Expected an array" });
    }

    for (const taskData of orderedTasks) {
      try {
        const objectId = new mongoose.Types.ObjectId(taskData._id);
        const updatedTask = await Todo.findByIdAndUpdate(
          objectId,
          { order: taskData.order },
          { new: true }
        );

        if (!updatedTask) {
          console.log(`Task with ID ${taskData._id} not found`);
        }
      } catch (objectIdError) {
        console.error("Invalid ObjectId:", taskData._id, objectIdError);
        return res.status(400).json({ error: "Invalid task ID" });
      }
    }

    res.json({ message: "Tasks reordered successfully" });
  } catch (error) {
    console.error("Error reordering tasks:", error);
    res.status(500).json({ error: error.message });
  }
});*/
app.listen(port, () => console.log(`Server listening on port ${port}`));
