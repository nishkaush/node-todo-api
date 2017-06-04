const expect = require("expect");
const request = require("supertest");
var ObjectID = require("mongodb").ObjectID;


const mongoose = require("mongoose").mongoose;
const app = require("./../server").app;
const Todo = require("./../models/todo").Todo;

const todos = require("./seed/seed").todos;
const populateTodos = require("./seed/seed").populateTodos;
const usersArr = require("./seed/seed").usersArr;
const populateUsers = require("./seed/seed").populateUsers;
var users = require("./../models/users").users;

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST/todos", () => {
    it("should create a new todo", (done) => {
        var text = "Test todo text";

        request(app)
            .post("/todos")
            .set("x-auth", usersArr[0].tokens[0].token)
            .send({
                text: text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({
                    text: text
                }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    // -----------------------------------------------------------------

    it("should be good format data", (done) => {
        request(app)
            .post("/todos")
            .set("x-auth", usersArr[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });

});

// -----------------------------------------------------------------

describe("GET /todos", () => {
    it("should get all todos", (done) => {
        request(app)
            .get("/todos")
            .set("x-auth", usersArr[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

// -----------------------------------------------------------------


describe("GET /todos/:id", () => {
    it("should have a valid id", (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set("x-auth", usersArr[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it("should not return a todo created by others", (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set("x-auth", usersArr[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("should return 404, if no results found", (done) => {
        var hexID = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexID}`)
            .set("x-auth", usersArr[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("should return 404, for non-object Ids", (done) => {
        request(app)
            .get(`/todos/592`)
            .set("x-auth", usersArr[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

});

// -----------------------------------------------------------------


describe("delete /todos/:id", () => {

    it('should remove the note', (done) => {
        var yourID = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${yourID}`)
            .set("x-auth", usersArr[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(yourID);
            })
            .end((err, re) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(yourID).then((doc) => {
                    expect(doc).toNotExist();
                    done();
                }).catch((e) => {
                    console.log("Lmao");
                    return done(e);
                });
            });
    });





    it('should not remove note created by others', (done) => {
        var yourID = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${yourID}`)
            .set("x-auth", usersArr[1].tokens[0].token)
            .expect(404)
            .end((err, re) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(yourID).then((doc) => {
                    expect(doc).toExist();
                    done();
                }).catch((e) => {
                    console.log("Lmao");
                    return done(e);
                });
            });
    });


    it("should return 404 if note not found", (done) => {
        var myID = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${myID}`)
            .set("x-auth", usersArr[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("should return 404 if ObjectID not valid", (done) => {
        request(app)
            .delete("/todos/123")
            .set("x-auth", usersArr[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

});

// -----------------------------------------------------------------

describe("PATCH /todos/:id", () => {
    it("should update todo", (done) => {
        var id = todos[0]._id.toHexString();
        var text = "I am so happy";
        request(app)
            .patch(`/todos/${id}`)
            .set("x-auth", usersArr[0].tokens[0].token)
            .send({
                completed: true,
                text: text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.doc.text).toBe(text);
                expect(res.body.doc.completed).toBe(true);
                expect(res.body.doc.completedAt).toBeA("number");
            })
            .end(done);
    });

    it("shouldn't update todo made by others", (done) => {
        var id = todos[0]._id.toHexString();
        var text = "I am so happy";
        request(app)
            .patch(`/todos/${id}`)
            .set("x-auth", usersArr[1].tokens[0].token)
            .send({
                completed: true,
                text: text
            })
            .expect(404)
            .end(done);
    });

    it("should clear completedAt when todo is not completed", (done) => {
        var id = todos[1]._id.toHexString();
        var text = "I am the best Nodejs develeloper";

        request(app)
            .patch(`/todos/${id}`)
            .set("x-auth", usersArr[1].tokens[0].token)
            .expect(200)
            .send({
                text: text,
                completed: false
            })
            .expect((res) => {
                expect(res.body.doc.text).toBe(text);
                expect(res.body.doc.completed).toBe(false);
                expect(res.body.doc.completedAt).toNotExist();
            })
            .end(done);
    });
});

// -----------------------------------------------------------------

describe("GET /users/me", () => {

    it("should return user if authenticated", (done) => {
        request(app)
            .get("/users/me")
            .set("x-auth", usersArr[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(usersArr[0]._id.toHexString());
                expect(res.body.email).toBe(usersArr[0].email);
            })
            .end(done);

    });

    it("should return 401 citing invalid token", (done) => {
        request(app)
            .get("/users/me")
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});


// -----------------------------------------------------------------

describe("POST /users", () => {

    it("should create a user", (done) => {
        var email = "example@example.com";
        var password = "123abc";

        request(app)
            .post("/users")
            .send({
                email: email,
                password: password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                users.findOne({
                    email: email
                }).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => {
                    return done(e);
                });
            });
    });

    it("should return validation error if request invalid", (done) => {
        request(app)
            .post("/users")
            .send({
                email: "kjjgnd",
                password: "123"
            })
            .expect(400)
            .end(done);

    });

    it("should not create user if email in use", (done) => {
        request(app)
            .post("/users")
            .send({
                email: usersArr[0].email,
                password: "fkskfrn@rr23"
            })
            .expect(400)
            .end(done);

    });
});

// -----------------------------------------------------------------


describe("POST /users/login", () => {

    it("should login user and return auth token", (done) => {
        request(app)
            .post("/users/login")
            .send({
                email: usersArr[1].email,
                password: usersArr[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                users.findById(usersArr[1]._id).then((user) => {
                    expect(user.tokens[1]).toInclude({
                        access: "auth",
                        token: res.headers["x-auth"]
                    });
                    done();
                }).catch((e) => {
                    return done(e);
                });
            });
    });

    it("should reject invalid login", (done) => {
        request(app)
            .post("/users/login")
            .send({
                email: usersArr[1].email,
                password: "wha"
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers["x-auth"]).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                users.findById(usersArr[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => {
                    return done(e);
                });
            });
    });

});

// -----------------------------------------------------------------


describe("DELETE /users/me/token", () => {

    it("should remove auth token on logout", (done) => {
        request(app)
            .delete("/users/me/token")
            .set("x-auth", usersArr[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                users.findById(usersArr[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });

});
