const moment = require('moment');
// const render = require('./render');
const deepAssign = require('deep-assign');

function newId() {
  let id = '';
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 10; i += 1) {
    id += chars[parseInt(Math.random() * chars.length)];
  }
  return id;
}

function newPost(title) {
  const slug = title.toLowerCase().replace(/ /g, '-');
  return {
    _id: newId(),
    title,
    tags: [],
    categories: [],
    date: new Date().toISOString(),
    content: '',
    source: `_drafts/${slug}.md`,
    raw: `title: ${title}\n---`,
    slug,
    updated: new Date().toISOString(),
    excerpt: '',
    layout: 'post',
    isDraft: true,
    isDiscarded: false,
    path: `${moment().format('YYYY/MM/DD/') + slug}/`,
  };
}

const settings = require('../../docs/demo/settings');
const posts = require('../../docs/demo/posts');

const config = {
  settings,
  posts,
};

// Create an collection in local
const ids = {};
config.posts.forEach((post) => {
  ids[post._id] = post;
});

export const getPosts = () => {
  console.log(config);
  return new Promise(resolve => resolve(config.posts));
};
export const getPost = id =>
  // Create a Promise
  new Promise((resolve, reject) => {
    // Find the first post with that id
    const data = config.posts.find(x => x._id === id);
    if (data) {
      return resolve(data);
    }

    return reject();
  });

export const getNewPost = (title) => {
  const post = newPost(title);
  ids[post._id] = post;
  config.posts.push(post);
  return Promise.resolve(post);
};
export const uploadImage = () => Promise.resolve(null);
export const remove = () => Promise.resolve(null);
export const publish = (id) => {
  ids[id].isDraft = false;
  return Promise.resolve(ids[id]);
};
export const unpublish = (id) => {
  ids[id].isDraft = true;
  return Promise.resolve(ids[id]);
};
export const renamePost = (id, filename) => Promise.resolve({ path: filename });
export const tagsAndCategories = () => Promise.resolve(config.tagsAndCategories);
export const getSettings = () => Promise.resolve(config.settings);
export const setSetting = (name, value, addedOptions) => {
  console.log(config.settings);
  if (!config.settings.options) {
    config.settings.options = {};
  }
  config.settings.options[name] = value;
  config.settings = deepAssign(config.settings, addedOptions);
  return Promise.resolve({
    updated: `Successfully updated ${name} = ${value}`,
    settings: config.settings,
  });
};
