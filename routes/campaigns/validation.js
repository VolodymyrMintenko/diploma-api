const yup = require("yup");
const User = require("../../models/User");

yup.addMethod(yup.string, "uniqueNameForUser", function (
  message,
  options = {}
) {
  return this.test("unique", message, async function (value) {
    if (!options.user) {
      return false;
    }

    return !options.user.campaigns.some((campaign) => campaign.name === value);
  });
});

yup.addMethod(yup.string, "userHaveAccess", function (message, options = {}) {
  return this.test("unique", message, async function (value) {
    if (!options.user) {
      return false;
    }

    return options.user.campaigns.smoe((campaign) => campaign.id === value);
  });
});

const validator = (schema) => (values) => {
  try {
    return schema.validate(values);
  } catch ({ message }) {
    return { message };
  }
};

const campaignValidator = (values, options = {}) => {
  const campaignValidationSchema = yup.object().shape({
    name: yup
      .string()
      .uniqueNameForUser(
        "You already have a campaign with this name.😱",
        options
      )
      .min(4, "Minimum title length 4 characters.")
      .required("Enter a name for the campaign."),
  });
  return validator(campaignValidationSchema)(values);
};

const campaignActivateValidator = (values, options = {}) => {
  const campaignActivateValidationSchema = yup.object().shape({
    id: yup
      .string()
      .userHaveAccess("You do not have access to this campaign.😱", options)
      .required("Choose a campaign."),
    active: yup.boolean("Choose a new status."),
  });
  return validator(campaignActivateValidationSchema)(values);
};

module.exports.campaignValidator = campaignValidator;
module.exports.campaignActivateValidator = campaignActivateValidator;
