const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = express.Router();

// Add a new Task
router.post("/tasks", auth, async (req, resp) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    resp.status(201).send(task);
  } catch (e) {
    console.log(e);
    resp.status(500).send();
  }
});

// Get All Tasks
// router.get("/tasks", async (req, resp) => {
//   try {
//     const tasks = await Task.find({});
//     resp.send(tasks);
//     console.log(tasks);
//   } catch (e) {
//     console.log(e);
//   }
// });

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc

// Get All Tasks for a the login User
router.get("/tasks", auth, async (req, resp) => {
  try {
    /*frist solution*/
    //const tasks = await Task.find({ owner: req.user._id });

    const match = {};
    const sort = {}

    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }

    if(req.query.sortBy){
      const parts = req.query.sortBy.split(':')
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.limit),
        sort
      },
    });

    resp.send(req.user.tasks);
  } catch (e) {
    console.log(e);
  }
});

// Get A Task By Id
router.get("/tasks/:id", auth, async (req, resp) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      
      return resp.status(404).send();
    }

    resp.send(task);
  } catch (e) {
    resp.status(500).send();
    console.log(e);
  }
});

// Update a Singel Task
router.put("/tasks/:id", auth, async (req, resp) => {
  const updates = Object.keys(req.body);
  const allowUpdate = ["description", "completed"];

  const isVaildUpdate = updates.every((update) => allowUpdate.includes(update));

  if (!isVaildUpdate) {
    resp.status(400).send({ error: "Invaild Update" });
  }
  try {
    const task = await Task.find({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      resp.status(404).send();
    }

    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();

    resp.send(task);
  } catch (e) {
    resp.status(500).send();
  }
});

router.delete("/tasks/:id", auth, async (req, resp) => {
  try {
    //const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return resp.status(404).send({ error: "Task Not Found!" });
    }

    resp.send(task);
  } catch (e) {
    resp.status(500).send();
  }
});

module.exports = router;
