
const admin = require('./');
const api = require('./api');

// for debugging
window.React = require('react');

const url = window.location.href.replace(/^.*\/\/[^\/]+/, '').split('/');
const rootPath = url.slice(0, url.indexOf('admin')).join('/');
api.init('rest', `${rootPath}/admin/api`);

document.addEventListener('DOMContentLoaded', () => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  admin(node);
});
