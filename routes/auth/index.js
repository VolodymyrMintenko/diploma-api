const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const messages = require("../../utils/messages");
const response = require("../../utils/response");
const validation = require("./validation");
const User = require("../../models/User");

// User register
router.post("/signup", async ({ body }, res) => {
  let result;
  try {
    result = await validation.registerValidator(body);
  } catch (e) {
    return res.status(400).send(response.error(e.message));
  }

  const hashedPassword = await bcrypt.hash(result.password, 10);
  const user = new User({
    login: result.login,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    const data = { id: savedUser._id };
    const secret = process.env.TOKEN_SECRET;
    const options = { expiresIn: "30d" };
    const token = jwt.sign(data, secret, options);

    return res.send(response.user(user, { token }));
  } catch (err) {
    res.status(400).send(err);
  }
});

// User login
router.post("/signin", async ({ body }, res) => {
  let result;
  try {
    result = await validation.loginValidator(body);
  } catch (e) {
    return res.status(400).send(response.error(e.message));
  }

  const user = await User.findOne({ login: result.login });

  if (!user) {
    return res.status(400).send(response.error(messages.invalidPassOrEmail));
  }

  const validPass = await bcrypt.compare(body.password, user.password);

  if (!validPass) {
    return res.status(400).send(response.error(messages.invalidPassOrEmail));
  }

  const data = { id: user._id };
  const secret = process.env.TOKEN_SECRET;
  const options = { expiresIn: "30d" };
  const token = jwt.sign(data, secret, options);

  res.send(response.user(user, { token }));
});

module.exports = router;
