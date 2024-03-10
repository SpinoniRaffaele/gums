const usersMock = require("./user");

let newId = 10;

const PROXY_CONFIG = {
  '/gums-1': {
    'bypass': function (req, res, proxyOptions) {
      if (req.url.startsWith('/gums-1/user')) {
        if (req.method === "GET") {
          res.end(JSON.stringify(usersMock.users));
          return;
        }
        if (req.method === "POST") {
          res.end(JSON.stringify({
            id: newId++,
            name: 'user' + newId,
            age: 12,
            email: 'email@test.com',
            isAdmin: false
          }));
          return;
        }
        if (req.method === "PUT") {
          res.end();
          return;
        }
        if (req.method === "DELETE") {
          res.end();
          return;
        }
        if (req.url.startsWith('/gums-1/auth/login')) {
          res.setHeader('x-auth-token', 'fake-token');
          res.end();
          return;
        }
        if (req.url.startsWith('/gums-1/auth/logout')) {
          res.end();
          return;
        }
      }
    }
  }
}

module.exports = PROXY_CONFIG;