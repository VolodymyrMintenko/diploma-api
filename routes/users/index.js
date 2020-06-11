const router = require("express").Router();
const User = require("../../models/User");
const response = require("../../utils/response");
const {
  getToken,
  getValidToken,
  verifyLoginToken,
} = require("../../middlewares/verification");
router.get("/", async (req, res) => {
  const { page = 1, limit = 100 } = req.query;
  const total = await User.countDocuments();
  const token = getValidToken(getToken(req));
  const users = await User.find()
    .skip(limit * (page - 1))
    .limit(limit);

  return res.send(response.paginated({ page, limit, total, data: users }));
});
router.get("/:id", async (req, res) => {
  const token = getValidToken(getToken(req));
  const id = req.params.id;

  if (token) {
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).send(response.error(messages.invalidPassOrEmail));
    }

    return res.send(response.user(user));
  }
});
router.get("/me", async (req, res) => {
  const token = getValidToken(getToken(req));

  if (token) {
    const user = await User.findById(token.id);

    if (!user) {
      return res.status(400).send(response.error(messages.invalidPassOrEmail));
    }

    return res.send(response.user(userme));
  }
});

module.exports = router;
