const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;


MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if (err) {
        return console.log("unable to connect to db server");
    }
    console.log("connected to mongo server");

    // db.collection("Users").deleteMany({
    //     name: "Andrew"
    // }).then((res) => {
    //     console.log(res);
    // });

    // db.collection("Todos").deleteOne({
    //     text: "something to do"
    // }).then((res) => {
    //     console.log(res);
    // });

    db.collection("Todos").findOneAndDelete({
        text: "wtf"
    }).then((res) => {
        console.log(res);
    });

    // db.close();


});
