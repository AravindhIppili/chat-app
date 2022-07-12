const User = require("../model/User");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
};

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const userNameCheck = await User.findOne({ username });
        if (userNameCheck)
            return res
                .status(400)
                .json({ msg: "Username alredy exists", status: false });
        const emailCheck = await User.findOne({ email });
        if (emailCheck)
            return res
                .status(400)
                .json({ msg: "Email alredy exists", status: false });
        const response = User.create({
            username,
            email,
            password,
        });
        const user = {
            _id: response._id,
            email: response.email,
            username: response.username,
            avatar: response.avatar,
            isAvatarSet: response.isAvatarSet,
        };
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        return res.status(201).json({ status: true, user });
    } catch (e) {
        next(e);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const response = await User.login(username, password);
        if (response._id) {
            const user = {
                _id: response._id,
                email: response.email,
                username: response.username,
                avatar: response.avatar,
                isAvatarSet: response.isAvatarSet,
            };
            const token = createToken(user._id);
            res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
            return res.status(201).json({ status: true, user });
        }
        return res.status(400).json(response);
    } catch (e) {
        next(e);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarSet: true,
            avatar: avatarImage,
        });
        return res.json({
            isSet: userData.isAvatarSet,
            image: userData.avatar,
        });
    } catch (e) {
        next(e);
    }
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatar",
            "_id",
        ]);
        return res.json(users);
    } catch (e) {
        next(e);
    }
};
