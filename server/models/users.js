var mongoose = require("mongoose");


var users = mongoose.model("user", {
    email: {
        required: true,
        trim: true,
        type: String,
        minlength: 1
    }
});


module.exports = {
    users: users
}
