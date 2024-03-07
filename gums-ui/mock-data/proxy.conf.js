const usersMock = require("./user");
const PROXY_CONFIG = {
  '/gums-1': {
    'bypass': function (req, res, proxyOptions) {
      switch (req.url) {
        case '/gums-1/user':
          if (req.method === "GET") {
            res.end(JSON.stringify(usersMock.users));
          }
          if (req.method === "POST") {
            res.end();
          }
          break;
        case '/gums-1/auth/login':
          res.setHeader('x-auth-token', 'fake-token');
          res.end();
          break;
        case '/gums-1/auth/logout':
          res.end();
          break;
      }
    }
  }
}

module.exports = PROXY_CONFIG;