const express = require("express");
const { default: mongoose } = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");

const router = new express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");

const { sendWelcomeEmail ,sendGoodByEmail } = require("../emails/account");

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    console.log(req);
    //console.log(req)
    
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a images with (jpg|jpeg|png)"));
    }

    cb(undefined, true);
    // cb(new Error('File must be a PDF'))
    // cb(undefined, treu)
    // cb(undefined, false)
  },
});

// Add a new users
router.post("/users", async (req, resp) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.username);
    const token = await user.generateToken();

    resp.status(201).send({ user, token });
  } catch (e) {
    resp.status(500).send(e);
  }
});

// Get All Users from DB
router.get("/users", async (req, resp) => {
  try {
    const users = await User.find({});
    resp.send(users);
  } catch (e) {
    resp.send(e);
  }
});

router.post("/users/logout", auth, async (req, resp) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    resp.send();
  } catch (e) {
    resp.status(500).send();
  }
});

router.post("/users/logoutall", auth, async (req, resp) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    resp.send();
  } catch (e) {
    resp.status(500).send();
    console.log(e);
  }
});

// Get my profile
router.get("/user/me", auth, async (req, resp) => {
  try {
    resp.send(req.user); //OPTIONAL fullname: #fname#, fulln LINE:B
  } catch (e) {
    resp.status(500).send();
  }
});

// Get a User ByID from DB
router.get("/users/:id", async (req, resp) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    resp.status(200).send(user);
  } catch (e) {
    console.log(e);
    resp.status(500).send();
  }
});

// Update Singel User
router.put("/user/me", auth, async (req, resp) => {
  const allowUpdate = ["username", "email", "password"];
  const updates = Object.keys(req.body);

  const isVaildUpdate = updates.every((update) => allowUpdate.includes(update));

  if (!isVaildUpdate) {
    console.log(req.body);
    return resp.status(400).send({ error: "Invaild Update" });
  }

  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    await req.user.save();

    resp.send(req.user);
  } catch (e) {
    resp.status(500).send(e);
  }
});

// test route
router.get("/users/test/test", async (req, resp) => {
  try {
    const users = await User.find({ email: "ahmed@example.com" });

    users.map((user) => {
      resp.send(user.hideImportantInfo()); //OPTIONAL .hideImportantInfo(): # #, .hideImportant() LINE:A
    });
  } catch (e) {
    resp.send(e);
  }
});

// Delete a User
router.delete("/users/me", auth, async (req, resp) => {
  try {
    sendGoodByEmail(req.user.email, req.user.username)
    await req.user.remove();

    resp.send(req.user);
  } catch (e) {
    resp.status(500).send();
  }
});

// Login
router.post("/users/login", async (req, resp) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();
    resp.send({ user, token });
  } catch (e) {
    resp.status(400).send({ error: e.message });
  }
});

// upload user img
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, resp) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    resp.send();
  },
  (error, req, resp, next) => {
    resp.status(400).send({ error: error.message });
  }
);

// Delete my Profile Pic
router.delete("/users/me/avatar", auth, async (req, resp) => {
  req.user.avatar = undefined;
  await req.user.save();
  resp.send();
});

// Get a user avatar by id
router.get("/users/:id/avatar", async (req, resp) => {
  const user = await User.findById(req.params.id);

  if (!user || !user.avatar) {
    throw new Error();
  }

  resp.set("Content-Type", "image/png");
  resp.send(user.avatar);
});

// Test case 1
router.get("/login", async (req, resp) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    resp.send({ user, token });
  } catch (e) {
    resp.status(400).send({ error: "Login Failed" });
    console.log(e);
  }
});

// Test case 2 statics and methods
router.post("/search", async (req, resp) => {
  try {
    const userEmail = await User.searchUser({ email: req.body.email });
    const newUserEmailUpper = await userEmail.upperCaseUsername();

    resp.send(newUserEmailUpper);
  } catch (e) {
    resp.status(500).send();
  }
});

// Test case 3 statics and methods
router.post("/prodctus", async (req, resp) => {
  try {
    const users = await User.find(req.body);
    resp.send(users.fullname);
  } catch (e) {
    resp.status(500).send();
  }
});
//test case not working
router.get("/getvir", async (req, resp) => {
  try {
    console.log(req.user);
    resp.send({
      calculatedAge: req.user.calculatedAge,
      ageInDays: req.user.ageInDays,
      ageInMonth: req.user.ageInMonth,
    });
  } catch (e) {
    resp.status(500).send();
    console.log(e);
  }
});

module.exports = router;
