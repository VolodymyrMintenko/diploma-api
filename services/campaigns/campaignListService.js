const mongoose = require("mongoose");
const Campaign = require("../../models/Campaign");
const User = require("../../models/User");

function mapCampaignsList(campaigns = []) {
  return campaigns.map(({ _id, name, active, minutesPlayed }) => ({
    id: _id,
    name,
    active,
    minutesPlayed,
  }));
}

async function getDMCampaigns({ page, limit, id }) {
  const user = await User.findById(id);
  if (!user) {
    return { page, limit, data: [], total: 0 };
  }
  const total = await Campaign.countDocuments();
  const campaigns = await Campaign.find()
    .skip(limit * (page - 1))
    .limit(limit);

  return { page, limit, data: mapCampaignsList(campaigns), total };
}

async function getActiveCampaigns({ page, limit }) {
  const options = {
    active: false,
  };
  const total = await Campaign.countDocuments(options);
  const campaigns = await Campaign.find(options)
    .skip(limit * (page - 1))
    .limit(limit);

  return { page, limit, data: mapCampaignsList(campaigns), total };
}
async function getDMCampaign({ id, user }) {
  if (!user) {
    return {};
  }
  let objectId = null;

  try {
    objectId = mongoose.Types.ObjectId(id);
  } catch (e) {
    return {};
  }

  const options = {
    $and: [{ _id: { $in: user.campaigns } }, { _id: objectId }],
  };
  const campaign = await Campaign.findOne(options);

  return campaign;
}
async function getClientCampaign({ id, user }) {
  if (!user) {
    return {};
  }
  let objectId = null;

  try {
    objectId = mongoose.Types.ObjectId(id);
  } catch (e) {
    return {};
  }

  const options = {
    _id: objectId,
  };
  const campaign = await Campaign.findOne(options);
  if (user.campaigns.includes(campaign._id)) {
    return campaign;
  } else {
    return { _id: campaign._id };
  }
}
async function getActiveCampaign(id) {
  const options = {
    _id: null,
    active: false,
  };

  try {
    options._id = mongoose.Types.ObjectId(id);
  } catch (e) {
    return {};
  }

  const campaign = await Campaign.findOne(options);

  if (campaign) {
    delete campaign.documents;
  }
  return campaign || {};
}

module.exports = {
  getDMCampaigns,
  getActiveCampaigns,
  getDMCampaign,
  getActiveCampaign,
  getClientCampaign,
};
