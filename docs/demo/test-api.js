
const Promise = require('es6-promise').Promise;
const moment = require('moment');
const render = require('./render');
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

module.exports = (config) => {
  const ids = {};
  config.posts.forEach(post => ids[post._id] = post);
  return {
    posts: () => Promise.resolve(config.posts),
    post: (id, data) => {
      if (data) {
        for (const name in data) {
          ids[id][name] = data[name];
        }
        if (data._content) {
          // ids[id].raw = yfm.stringify(ids[id])
          ids[id].content = render({ text: data._content });
        }
        return Promise.resolve({ post: ids[id], tagsAndCategories: config.tagsAndCategories });
      }
      return Promise.resolve(ids[id]);
    },

    newPost: (title) => {
      const post = newPost(title);
      ids[post._id] = post;
      config.posts.push(post);
      return Promise.resolve(post);
    },
    uploadImage: data => Promise.resolve(null),
    remove: id => Promise.resolve(null),
    publish: (id) => {
      ids[id].isDraft = false;
      return Promise.resolve(ids[id]);
    },
    unpublish: (id) => {
      ids[id].isDraft = true;
      return Promise.resolve(ids[id]);
    },
    renamePost: (id, filename) => Promise.resolve({ path: filename }),
    tagsAndCategories: () => Promise.resolve(config.tagsAndCategories),
    settings: () => Promise.resolve(config.settings),
    setSetting: (name, value, addedOptions) => {
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
    },
  };
};
