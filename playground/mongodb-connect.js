// const MongoClient = require("mongodb").MongoClient;
// const ObjectID = require("mongodb").ObjectID;
const {
    MongoClient,
    ObjectID
} = require("mongodb");


// var obj = new ObjectID(); ----> this creates a unique instance
// console.log(obj);  ---->>this will be a unique value every time



MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if (err) {
        return console.log("unable to connect to db server");
    }
    console.log("connected to mongo server");

    // db.collection("Todos").insertOne({
    //     text: "something to do",
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log("Unable to insert", err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });


    // db.collection("Users").insertOne({
    //     name: "Andrew",
    //     age: 29,
    //     location: "California"
    // }, (err, result) => {
    //     if (err) {
    //         return console.log("This is the error while inserting:", err);
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
    // });

    db.close();
});
