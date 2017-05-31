const expect = require("expect");
const request = require("supertest");
var ObjectID = require("mongodb").ObjectID;


const mongoose = require("mongoose").mongoose;
const app = require("./../server").app;
const Todo = require("./../models/todo").Todo;


const todos = [{
    _id: new ObjectID(),
    text: "First test todo"
}, {
    _id: new ObjectID(),
    text: "second test todo",
    completed: true,
    completedAt: 333
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});


describe("POST/todos", () => {
    it("should create a new todo", (done) => {
        var text = "Test todo text";

        request(app)
            .post("/todos")
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
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

// -----------------------------------------------------------------


describe("GET /todos/:id", () => {
    it("should have a valid id", (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it("should return 404, if no results found", (done) => {
        var hexID = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexID}`)
            .expect(404)
            .end(done);
    });

    it("should return 404, for non-object Ids", (done) => {
        request(app)
            .get(`/todos/592`)
            .expect(404)
            .end(done);
    });

});

// -----------------------------------------------------------------


describe("delete /todos/:id", () => {

    it('should remove the note', (done) => {
        var yourID = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${yourID}`)
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

    it("should return 404 if note not found", (done) => {
        var myID = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${myID}`)
            .expect(404)
            .end(done);
    });

    it("should return 404 if ObjectID not valid", (done) => {
        request(app)
            .delete("/todos/123")
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

    it("should clear completedAt when todo is not completed", (done) => {
        var id = todos[1]._id.toHexString();
        var text = "I am the best Nodejs develeloper";

        request(app)
            .patch(`/todos/${id}`)
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
