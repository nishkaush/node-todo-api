var express = require("express");
var bodyParser = require("body-parser");

var ObjectID = require("mongodb").ObjectID;
var mongoose = require("./db/mongoose").mongoose;
var Todo = require("./models/todo").Todo;
var users = require("./models/users").users;


var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


// --------------------------------------------

app.post("/todos", (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

//----------------------------------------------

app.get("/todos", (req, res) => {

    Todo.find().then((todos) => {
        res.send({
            todos: todos
        });
    }, (e) => {
        res.status(400).send(e);
    });
});

//----------------------------------------------

app.get("/todos/:id", (req, res) => {
    var someId = req.params.id;

    if (!ObjectID.isValid(someId)) {
        return res.status(404).send();
    }

    Todo.findById({
        _id: someId
    }).then((result) => {
        if (!result) {
            console.log("entry not found");
            return res.status(404).send();
        }
        return res.status(200).send(result);
    }).catch((e) => {
        console.log("INVALID ID, CAN'T FETCH TODO!!")
        res.status(404).send();
    });
});









app.listen(port, () => {
    console.log(`started up at port ${port}`);
});





module.exports = {
    app: app
};
