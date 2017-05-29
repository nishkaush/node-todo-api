// const MongoClient = require("mongodb").MongoClient;
// const ObjectID = require("mongodb").ObjectID;
// const {
//     MongoClient,
//     ObjectID
// } = require("mongodb");


// var obj = new ObjectID(); ----> this creates a unique instance
// console.log(obj);  ---->>this will be a unique value every time

// MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
//             if (err) {
//                 return console.log("unable to connect to db server");
//             }
//             console.log("connected to mongo server");

// db.collection("Todos").find({
//     _id: new ObjectID("591f125ca4cbb10316e0b84b")
// }).toArray().then((docs) => {
//     console.log("Todos");
//     console.log(JSON.stringify(docs, undefined, 2));
// }, (err) => {
//     console.log("unable to reach todos", err);
// });

// db.collection("Todos").find().count().then((count) => {
//     console.log(count);
// }, (err) => {
//     console.log("unable to get count", err);
// });

// });

// ===========================================

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;


MongoClient.connect("mongodb://localhost:27017/TodoApp").then((db) => {
    console.log("connected to mongo server");
    db.collection("Users").find({
        name: "Andrew"
    }).toArray().then((res) => {
        console.log(JSON.stringify(res, undefined, 2));
    });
}, () => {
    throw new Error("cant connect to db");
});



// someshit.connect().then((argfunc1) => {
//
// shitfunc2.connect().
// }, (argfunc2) => {
//
// });


// if (err) {
//     console.log("something went wrong");
// }
// console.log("connected to mongo server");
//
// db.collection("Users").find({
//     name: "Andrew"
// }).toArray().then((res) => {
//     console.log(JSON.stringify(res, undefined, 2));
// });
