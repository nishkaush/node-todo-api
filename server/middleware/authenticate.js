var users = require("./../models/users").users;

var authenticate = (req, res, next) => {
    var token = req.header("x-auth");

    users.findByToken(token).then((user) => {
        if (!user) {
            Promise.reject();
        }
        req.user = user; //--set user property on req to send it forward
        req.token = token; //--set token property on req to send it further
        next();
    }).catch((e) => {
        res.status(401).send();
    });
};


module.exports.authenticate = authenticate;
