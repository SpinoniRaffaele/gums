const usersMock = require("./user");
const PROXY_CONFIG = {
  '/gums-1': {
    'bypass': function (req, res, proxyOptions) {
      switch (req.url) {
        case '/gums-1/user':
          console.log(req.method);
          res.end(JSON.stringify(usersMock.users));
          return true;
      }
    }
  }
}

module.exports = PROXY_CONFIG;