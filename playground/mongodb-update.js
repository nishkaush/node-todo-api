const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;


MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if (err) {
        return console.log("unable to connect to db server");
    }
    console.log("connected to mongo server");

    db.collection("Users").findOneAndUpdate({
        name: "Andy"
    }, {
        $inc: {
            age: -11
        },
        $set: {
            name: "lol"
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(res);
        ''
    });


    // db.collection("Todos").findOneAndUpdate({
    //     _id: new ObjectID("59218e15f744b9fb4538f159")
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((res) => {
    //     console.log(res);
    // });


    // db.close();


});
