const mapUser = (user) => {
  const { login, campaigns } = user;
  return { login, campaigns };
};
const mapCampaign = (camapign) => {
  const {
    _id: id,
    name,
    active,
    lastActive,
    minutesPlayed,
    documents,
  } = camapign;
  return {
    id,
    name,
    active,
    lastActive,
    minutesPlayed,
    documents,
  };
};
const response = {
  empty() {
    return {
      status: true,
      payload: {},
    };
  },
  error(message) {
    return {
      status: false,
      payload: {
        message,
        options: {
          variant: "error",
        },
      },
    };
  },
  success(message) {
    return {
      status: true,
      payload: {
        message,
        options: {
          variant: "success",
        },
      },
    };
  },
  paginated({ page, limit, total, data }) {
    return {
      status: true,
      payload: {
        page,
        limit,
        total,
        data,
      },
    };
  },
  user(user, addition) {
    const userData = mapUser(user);
    console.log(userData);
    return {
      status: true,
      payload: {
        ...userData,
        ...addition,
      },
    };
  },
  camapign(camapign, addition) {
    const camapignData = mapCampaign(camapign);
    return {
      status: true,
      payload: {
        ...camapignData,
        ...addition,
      },
    };
  },
  userWithMessage(message, user, addition) {
    const userData = mapUser(user);
    return {
      status: true,
      payload: {
        user: {
          ...userData,
          ...addition,
        },
        message,
        options: {
          variant: "success",
        },
      },
    };
  },
  token(token) {
    return {
      status: true,
      payload: {
        token,
      },
    };
  },
};

module.exports = response;
