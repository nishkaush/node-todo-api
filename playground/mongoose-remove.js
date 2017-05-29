const mongoose = require("./../server/db/mongoose").mongoose;
const Todo = require("./../server/models/todo").Todo;
const users = require("./../server/models/users").users;

const ObjectID = require("mongodb").ObjectID;



// Todo.findByIdAndRemove("592b76b3959b351059f4e38d").then((doc) => {
//     console.log(doc);
// });
