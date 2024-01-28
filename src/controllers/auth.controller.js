const authController = {};
const bcrypt = require("bcryptjs");
const User = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

authController.register = async (req, res, next) => {
  const { username, name, surname, email, password } = req.body;

  // Check if Error existing in data user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check The email => if existing in db or not
  const emailExist = await User.findOne({ email });
  if (emailExist)
    return res.status(401).json({ msg: "Email is already exists" });
  const usernameExist = await User.findOne({ username });
  if (usernameExist)
    return res.status(401).json({ msg: "Username is already exists" });

  // تشفير الباسورد
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    name,
    surname,
    email,
    password: hashPassword,
  });

  try {
    const saveUser = await newUser.save();
    if (saveUser) res.send({ message: "success" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

authController.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { error } = loginValidation(req.body);
    if (error) return res.status(401).json({ msg: error.details[0].message });

    // Check the email
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ msg: "Invalid Username!" });

    // Valid Password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ msg: "Invalid Password!" });

    const userToken = await jwt.sign({ _id: user._id }, process.env.TOKEN);
    res.status(200).json({ msg: "Success", userToken });
  } catch (error) {
    res.status(400).json({ msg: "Bad Request" });
  }
};

module.exports = authController;
