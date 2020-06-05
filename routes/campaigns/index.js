const router = require("express").Router();
const User = require("../../models/User");
const Campaign = require("../../models/Campaign");
const {
  getToken,
  getValidToken,
  verifyLoginToken,
} = require("../../middlewares/verification");
const response = require("../../utils/response");
const validation = require("./validation");
const {
  getDMCampaigns,
  getActiveCampaigns,
  getDMCampaign,
  getActiveCampaign,
  getClientCampaign,
} = require("../../services/campaigns/campaignListService");

router.get("/", async (req, res) => {
  const { page = 1, limit = 100 } = req.query;

  const token = getValidToken(getToken(req));
  const campaigns = await (token
    ? getDMCampaigns({ page, limit, id: token.id })
    : getActiveCampaigns({ page, limit }));

  return res.send(response.paginated(campaigns));
});

router.get("/:id", async (req, res) => {
  const token = getValidToken(getToken(req));
  const id = req.params.id;

  if (token) {
    const user = await User.findById(token.id);

    if (!user) {
      return res.status(400).send(response.error(messages.invalidPassOrEmail));
    }

    const campaign = await getClientCampaign({ id, user });

    return res.send(response.camapign(campaign));
  }
});

router.post("/", verifyLoginToken, async (req, res) => {
  let result;
  const token = getValidToken(getToken(req));

  const user = await User.findById(token.id);

  if (!user) {
    return res.status(400).send(response.error(messages.invalidPassOrEmail));
  }

  try {
    result = await validation.campaignValidator(req.body, { user });
  } catch (e) {
    return res.status(400).send(response.error(e.message));
  }

  const campaign = new Campaign({ name: result.name });
  user.campaigns.push(campaign);
  await campaign.save();
  await user.save();

  res.send(response.camapign(campaign));
});

router.put("/:id/activate", verifyLoginToken, async (req, res) => {
  let result;
  const token = getValidToken(getToken(req));

  const id = req.params.id;
  req.body.active;

  const user = await User.findById(token.id);

  if (!user) {
    return res.status(400).send(response.error(messages.invalidPassOrEmail));
  }

  try {
    result = await validation.campaignActivateValidator(
      { ...req.body, id },
      { user }
    );
  } catch (e) {
    return res.status(400).send(response.error(e.message));
  }

  const campaign = await Campaign.findById(result.id);
  const lastActive = campaign.lastActive;

  campaign.lastActive = new Date();
  campaign.active = result.active;

  if (!result.active && lastActive) {
    const playedMins = Math.round((campaign.lastActive - lastActive) / 60000);
    campaign.minutesPlayed += playedMins;
  }

  await campaign.save();

  res.send(response.camapign(campaign));
});
router.delete("/:id", verifyLoginToken, async (req, res) => {
  let result;
  const token = getValidToken(getToken(req));

  const id = req.params.id;

  const user = await User.findById(token.id);

  if (!user) {
    return res.status(400).send(response.error(messages.invalidPassOrEmail));
  }
  await Campaign.findByIdAndRemove(id);
  // console.log(user.campaigns);
  // user.campaigns = user.campaigns.filter((campaignid) => campaignid != id);

  // await user.save();
  await User.update(
    { _id: token.id },
    { campaigns: user.campaigns.filter((campaignid) => campaignid != id) }
  );
  return res.send(response.success());
});

module.exports = router;
