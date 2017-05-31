const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const _ = require("lodash");

var userSchema = new mongoose.Schema({
    email: {
        required: true,
        trim: true,
        type: String,
        minlength: 1,
        unique: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});


userSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ["_id", "email"]);
};


userSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = "auth";

    var token = jwt.sign({
        _id: user._id.toHexString(),
        access: access
    }, "some secret value/Salting").toString();

    user.tokens.push({
        access: access,
        token: token
    });

    user.save().then(() => {
        return token;
    });

};


var users = mongoose.model("user", userSchema);

module.exports = {
    users: users
}
