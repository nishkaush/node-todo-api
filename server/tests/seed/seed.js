const ObjectID = require("mongodb").ObjectID;
const Todo = require("./../../models/todo").Todo;
const users = require("./../../models/users").users;
const jwt = require("jsonwebtoken");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const usersArr = [{
    _id: userOneId,
    email: "lola@example.com",
    password: "firstpass",
    tokens: [{
        access: "auth",
        token: jwt.sign({
            _id: userOneId,
            access: "auth"
        }, "some secret value/Salting").toString()
    }]
}, {
    _id: userTwoId,
    email: "whatever@example.com",
    password: "secondpass",
    tokens: [{
        access: "auth",
        token: jwt.sign({
            _id: userTwoId,
            access: "auth"
        }, "some secret value/Salting").toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    text: "First test todo",
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: "second test todo",
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    users.remove({}).then(() => {
        var userOne = new users(usersArr[0]).save();
        var userTwo = new users(usersArr[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
};

// module.exports.todos = todos;
// module.exports.populateTodos = populateTodos;

// OR
module.exports = {
    todos: todos,
    populateTodos: populateTodos,
    usersArr: usersArr,
    populateUsers: populateUsers
};
