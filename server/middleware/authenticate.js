var users = require("./../models/users").users;

var authenticate = (req, res, next) => {
    var token = req.header("x-auth");

    users.findByToken(token).then((user) => {
        if (!user) {
            Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
    });
};


module.exports.authenticate = authenticate;
