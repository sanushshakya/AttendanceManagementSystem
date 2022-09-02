const vars = require("./vars.configs");
module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Hajiri System",
    contact: {},
    version: "1.0",
  },
  servers: [
    {
      url: vars.api_base_url,
      variables: {
        port: {
          default: vars.port,
          description: "base api url",
        },
      },
    },
  ],
  components: {
    securitySchemes: {
      BasicAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
  security: [
    {
      BasicAuth: [],
    },
  ],
  tags: [
    {
      name: "Setting",
      description: "application wide setting",
    },
    {
      name: "Auth",
      description: "authentication of users",
    },
    {
      name: "User",
      description: "users",
    },
    {
      name: "Role",
      description: "roles",
    },
    {
      name: "Attendance",
      description: "attendance",
    },
    {
      name: "Break",
      description: "break",
    },
    {
      name: "Leave",
      description: "leave",
    },
    {
      name: "Absent",
      description: "absent",
    },
    {
      name: "Holiday",
      description: "holiday",
    },
  ],
};
