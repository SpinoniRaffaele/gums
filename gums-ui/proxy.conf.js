const PROXY_CONFIG = {
  '/': {
    'target': 'http://localhost:8080',
    'bypass': function (req, res, proxyOptions) {
      switch (req.url) {
        case '/users':
          console.log(req.method);
          res.end(JSON.stringify({response: "ok"}));
          return true;
      }
    }
  }
}

module.exports = PROXY_CONFIG;