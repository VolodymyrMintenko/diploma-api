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
    .min(4, "Минимальная длина логина 4 символа.")
    .required("Введите логин."),
  password: yup
    .string()
    .min(4, "Минимальная длина пароля 4 символa.")
    .required("Введите пароль."),
});

const registerValidationSchema = yup.object().shape({
  login: yup
    .string()
    .uniqueLogin("Этот логин уже занят.😱")
    .min(4, "Минимальная длина логина 4 символа.")
    .required("Введите логин."),
  password: yup
    .string()
    .min(4, "Минимальная длина пароля 4 символa.")
    .required("Введите пароль."),
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
