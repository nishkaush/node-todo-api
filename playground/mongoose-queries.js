const mongoose = require("./../server/db/mongoose").mongoose;
const Todo = require("./../server/models/todo").Todo;
const users = require("./../server/models/users").users;
const ObjectID = require("mongodb").ObjectID;

var myid = "5928f2c714d30c05d2ec9f5caaaa";

var userid = "592229773bfd9e0fe112b943";
//
// if (!ObjectID.isValid(myid)) {
//     return console.log("Can't find any entry with the provided ID. Please enter a valid ID");
// }


// Todo.find({
//     _id: myid
// }).then((res) => {
//     if (res.length === 0) {
//         return console.log("What a pain!");
//     }
//     console.log(res);
// }, (e) => {
//     console.log("can't find that shit");
// });

// Todo.findOne({
//     completed: false
// }).then((res) => {
//     console.log(res);
// }, (e) => {
//     console.log(e);
// });

//
// Todo.findById(myid).then((res) => {
//     if (!res) {
//         return console.log("What a pain!");
//     }
//     console.log(res);
// });


users.findById(userid).then((res) => {
    if (!res) {
        return console.log("not found");
    }
    console.log(res);
}).catch((e) => {
    console.log("Wow this aint working!");
})
