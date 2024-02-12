const usersMock = require("./user");
const PROXY_CONFIG = {
  '/gums-1': {
    'bypass': function (req, res, proxyOptions) {
      switch (req.url) {
        case '/gums-1/user':
          if (req.method === "GET") {
            res.end(JSON.stringify(usersMock.users));
            return true;
          }
          if (req.method === "POST") {
            res.end();
            return true;
          }
      }
    }
  }
}

module.exports = PROXY_CONFIG;