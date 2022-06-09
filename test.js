// // const { MongoClient } = require("mongodb");

// // const url = "mongodb://127.0.0.1:27017";

// // ********************* Insert New Docmnet ***************
// /*
// MongoClient.connect(url, (error, client) => {
//   if (error) {
//     return console.log("Thee some Erro OOcoud Coneect");
//   }

//   const db = client.db('task-manager')
//   const dbinsert = db
//     .collection("users")
//     .insertOne({ name: "john", age: 22 });

//   dbinsert
//     .then((result) => {
//       console.log(result);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });
// */

// /* ******** deleteOne*******
// MongoClient.connect(url, (error, client) => {
//   if (error) {
//     return console.log(error);
//   }

//   const db = client.db("task-manager");

//   const deleteDoc = db.collection("users").deleteOne({
//     age: 25 ,
//   });

//   deleteDoc
//     .then((result) => {
//       console.log(result);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });
// */

// const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/School");

// const Course = mongoose.model("Course", {
//   name: {
//     type: String,
//     required: true,
//     //trim: true, //DISABLED LINE:A
//   },

//   Registered: {
//     type: Number,
//     default: 1, //DISABLED LINE:B
//   },
// });

// const newCourse = new Course({
//   name: "   HTML",
// });

// newCourse 
//   .save()
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// const jwt = require("jsonwebtoken");

// const myFunc = () => {
//   const token = jwt.sign({ _id: "a123456" }, "nodeChallenges"); //OPTIONAL .sign: # #, .login , .token LINE:A
//   console.log(token);

//   const data = jwt.verify(token, "nodeChallenes"); //OPTIONAL nodeChallenges: #nodeChallen#,  LINE:B
//   console.log(data);
// };

// myFunc();

/*  //Realtion between docments
require("./src/db/mongoose");  //DISABLED LINE:A
const User = require("./src/models/user");
const Task = require("./src/models/task");



const main = async () => {
  // const task = await Task.findById('628e2a70751e141eed6b0713');
  // await task.populate('owner');
  // console.log(task.owner);

  const user = await User.findById("628e292b1832eca4d35896a7");
  await user.populate("tasks");
  console.log(user.tasks);
};

main()
*/

