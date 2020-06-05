const yup = require("yup");
const User = require("../../models/User");

yup.addMethod(yup.string, "uniqueLogin", function (message) {
  return this.test("unique", message, async function (value) {
    const user = await User.findOne({ login: value });
    return user === null;
  });
});

const loginValidationSchema = yup.object().shape({
  login: yup
    .string()
    .min(4, "Minimum login length 4 characters.")
    .required("Enter login."),
  password: yup
    .string()
    .min(4, "Minimum password length 4 characters.")
    .required("Enter password."),
});

const registerValidationSchema = yup.object().shape({
  login: yup
    .string()
    .uniqueLogin("This login is already taken.😱")
    .min(4, "Minimum login length 4 characters.")
    .required("Enter login."),
  password: yup
    .string()
    .min(4, "Minimum password length 4 characters.")
    .required("Enter password."),
});

const validator = (schema) => (values) => {
  try {
    return schema.validate(values);
  } catch ({ message }) {
    return { message };
  }
};

module.exports.loginValidator = validator(loginValidationSchema);
module.exports.registerValidator = validator(registerValidationSchema);
