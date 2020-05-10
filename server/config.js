module.exports = {
  database: {
    url: process.env.MONGODB_URI || "mongodb://localhost:27017/xcase",
  },
  morgan: {
    enabled: false,
    options: {
      theme: "dimmed",
    },
  },
  log4js: {
    appenders: {
      console: {
        type: "stdout",
        layout: {
          type: "colored",
        },
      },
    },
    categories: {
      default: {
        appenders: ["console"],
        level: process.env.LOG_LEVEL || "debug",
      },
    },
  },
  express: {
    level: "info",
    format: (req, res, format) =>
      format(`:remote-addr :method :url ${JSON.stringify(req.body)} - :status`),
    statusRules: [
      { from: 200, to: 399, level: "info" },
      { from: 400, to: 599, level: "warn" },
    ],
  },
  errors: {
    "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters": {
      status: 400,
      message: "argument not valid",
    },
  },
  swagger: {
    basedir: __dirname,
    files: ["./routes.js"],
    swaggerDefinition: {
      info: {
        title: "xCase API",
        version: "0.1.0",
      },
    },
  },
  assistant: {
    id: process.env.ASSISTANT_ID,
    apikey: process.env.ASSISTANT_API_KEY,
    url: process.env.ASSISTANT_URL,
    version: '2020-04-01'
  }
};
