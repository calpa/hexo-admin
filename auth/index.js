/**
 * This enables authentication for the admin pages.
 * All paths starting with /admin/ are protected by cookie-based login, where
 * username must match `admin.username` and the password's bcrypt hash must match
 * `admin.password_hash`.
 */

const cookieParser = require('cookie-parser');
const serveStatic = require('serve-static');
const session = require('express-session');
const bodyParser = require('body-parser');
const auth = require('connect-auth');
const path = require('path');
const authStrategy = require('./strategy');

module.exports = (app, hexo) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: hexo.config.admin.secret,
  }));
  app.use(`${hexo.config.root}admin`, auth(new authStrategy(hexo)));
  app.use(`${hexo.config.root}admin/login`, (req, res) => {
    if (req.method === 'POST') {
      req.authenticate(['adminAuth'], (error, done) => {
        if (done) {
          res.writeHead(302, { Location: `${hexo.config.root}admin/` });
          res.end();
        }
      });
    } else {
      serveStatic(path.join(__dirname, '../www', 'login'))(req, res);
    }
  });
  app.use(`${hexo.config.root}admin/`, (req, res, next) => {
    req.authenticate(['adminAuth'], next);
  });
};
