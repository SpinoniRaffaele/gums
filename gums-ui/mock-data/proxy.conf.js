const usersMock = require("./user");
const projectsMock = require("./projects");

let newId = 10;

const PROXY_CONFIG = {
  '/gums': {
    'bypass': function (req, res, proxyOptions) {
      if (req.url.startsWith('/gums/user')) {
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
        if (req.method === "PUT" || req.method === "DELETE") {
          res.end();
          return;
        }
      }
      if (req.url.startsWith('/gums/project')) {
        if (req.method === "GET") {
          res.end(JSON.stringify(projectsMock.projects));
          return;
        }
        if (req.method === "PUT" || req.method === "DELETE") {
          res.end();
          return;
        }
      }
      if (req.url.startsWith('/gums/auth/login')) {
        res.setHeader('x-auth-token', 'fake-token');
        res.end();
        return;
      }
      if (req.url.startsWith('/gums/auth/logout')) {
        res.end();
        return;
      }
    }
  }
}

module.exports = PROXY_CONFIG;