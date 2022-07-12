const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, "8h4h@j%db#2jd", async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect("/login");
            } else {
                let user = await User.findById(decodedToken.id);
                if (user) {
                    console.log(decodedToken);
                    next();
                } else {
                    res.status(403).json({
                        msg: "Not Authorized",
                        status: false,
                    });
                }
            }
        });
    } else {
        res.status(403).json({ msg: "Not Authorized", status: false });
    }
};

const checkUser = function (req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, "8h4h@j%db#2jd", async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};
module.exports = { requireAuth, checkUser };
