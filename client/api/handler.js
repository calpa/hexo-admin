const request = require('superagent');

export const handlePost = (baseUrl, url, data) => new Promise((f, r) => {
  let req = request.post(baseUrl + url);
  if (data) {
    req = req.send(data);
  }
  req.end((err, res) => {
    if (err) return r(err);
    f(res.body);
  });
});

export const handleGet = (baseUrl, url, params) => new Promise((f, r) => {
  let req = request.get(baseUrl + url);
  if (params) {
    req = req.query(params);
  }
  req.end((err, res) => {
    if (err) return r(err);
    f(res.body);
  });
});
