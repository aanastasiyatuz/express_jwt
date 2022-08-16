const ApiError = require("../utils/error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateJwt = (id, email) => {
    return jwt.sign({ id, email }, process.env.SECRET_KEY, {
        expiresIn: "24h",
    });
};

const registration = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(ApiError.badRequest("Wrong email or password"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
        return next(ApiError.badRequest("User with such email already exists"));
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, password: hashPassword });
    const token = generateJwt(user.id, user.email);
    return res.json({ token });
}
const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return next(ApiError.badRequest("There is no user with such email"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
        return next(ApiError.badRequest("There is no user with such email"));
    }
    const token = generateJwt(user.id, user.email);
    return res.json({ token });
}

const check = async (req, res, next) => {
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json({ token });
}

module.exports = {
    registration,
    login,
    check
}