const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const _ = require("lodash");
const bcrypt = require("bcryptjs");

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

// ========================================

userSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ["_id", "email"]);
};

// ========================================

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

    return user.save().then(() => {
        return token;
    });
};

// ========================================

// .statics is model method || generateAuthToken, toJSON are instance methods

userSchema.statics.findByToken = function(token) {
    var user = this;
    var decoded;

    try {
        decoded = jwt.verify(token, "some secret value/Salting");
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // }); OR
        return Promise.reject();
    }

    return user.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': "auth"
    });


};


userSchema.pre("save", function(next) {
    var user = this;

    if (user.isModified("password")) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});





var users = mongoose.model("user", userSchema);

module.exports = {
    users: users
}
