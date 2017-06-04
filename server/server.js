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
var authenticate = require("./middleware/authenticate").authenticate;
const bcrypt = require("bcryptjs");


var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());


// --------------------------------------------

app.post("/todos", authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

//---------------------------------------------------------------

app.get("/todos", authenticate, (req, res) => {

    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({
            todos: todos
        });
    }, (e) => {
        res.status(400).send(e);
    });
});

//-----------------------------------------------------------------

app.get("/todos/:id", authenticate, (req, res) => {
    var someId = req.params.id;

    if (!ObjectID.isValid(someId)) {
        return res.status(404).send();
    }

    Todo.findOne({
        _id: someId,
        _creator: req.user._id
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

app.delete("/todos/:id", authenticate, (req, res) => {
    var randomID = req.params.id;

    if (!ObjectID.isValid(randomID)) {
        console.log("Wrong ID Format, please provide a valid ID");
        return res.status(404).send();
    }

    console.log("Valid Id format, now searching....");
    Todo.findOneAndRemove({
        _id: randomID,
        _creator: req.user._id
    }).then((doc) => {
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

//--------------------------------------------------------------

app.patch("/todos/:id", authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {
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

//------------------------------------------------------------


app.post("/users", (req, res) => {
    var body = _.pick(req.body, ["email", "password"]);
    var user = new users(body);


    user.save().then((user) => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header("x-auth", token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

//-------------------------------------------------------------

app.get("/users/me", authenticate, (req, res) => {
    res.send(req.user);
});

//-------------------------------------------------------------

app.post("/users/login", (req, res) => {
    var body = _.pick(req.body, ["email", "password"]);

    users.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header("x-auth", token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });

    // var hashedPassword;
    // users.findOne({
    //     email: req.body.email
    // }).then((result) => {
    //     hashedPassword = result.password;
    //     bcrypt.compare(req.body.password, hashedPassword, (err, re) => {
    //         if (err) {
    //             return console.log(err);
    //         }
    //         res.send("User Found,Welcome back!");
    //     });
    // }).catch((e) => {
    //     res.send("cant find user");
    // });

});

//-------------------------------------------------------------

app.delete("/users/me/token", authenticate, (req, res) => {

    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, (err) => {
        res.status(400).send();
    });
});





app.listen(port, () => {
    console.log(`started up at port ${port}`);
});

module.exports = {
    app: app
};
