var env = process.env.NODE_ENV || "development";
console.log("@@@@@@@", env);

if (env === "development") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp"
} else if (env === "test") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest"
}

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");

var ObjectID = require("mongodb").ObjectID;
var mongoose = require("./db/mongoose").mongoose;
var Todo = require("./models/todo").Todo;
var users = require("./models/users").users;
const jwt = require("jsonwebtoken");



var app = express();
const port = process.env.PORT;

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

//---------------------------------------------------------------------------

app.get("/todos", (req, res) => {

    Todo.find().then((todos) => {
        res.send({
            todos: todos
        });
    }, (e) => {
        res.status(400).send(e);
    });
});

//----------------------------------------------------------------------------

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

//--------------------------------------------------------------------------

app.delete("/todos/:id", (req, res) => {
    var randomID = req.params.id;

    if (!ObjectID.isValid(randomID)) {
        console.log("Wrong ID Format, please provide a valid ID");
        return res.status(404).send();
    }

    console.log("Valid Id format, now searching....");
    Todo.findByIdAndRemove(`${randomID}`).then((doc) => {
        if (!doc) {
            console.log("No results Found");
            return res.status(404).send();
        }
        console.log("Deleted the doc successfully!");
        return res.status(200).send(doc);
    }).catch((e) => {
        console.log("couldn't delete the note:", e);
        res.status(400).send();
    });
});

//----------------------------------------------------------------------------

app.patch("/todos/:id", (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ["text", "completed"]);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then((doc) => {
        if (!doc) {
            return res.status(404).send();
        }
        res.send({
            doc: doc
        });
    }).catch((e) => {
        res.status(400).send();
    });

});

//-----------------------------------------------------------------------------


app.post("/users", (req, res) => {
    var body = _.pick(req.body, ["email", "password"]);
    var user = new users(body);


    // Model Methods ---> used for "users" in the model method for mongoose
    // Instance Methods ---> used for the var user created above using the model

    user.save().then((user) => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header("x-auth", token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});









app.listen(port, () => {
    console.log(`started up at port ${port}`);
});

module.exports = {
    app: app
};
