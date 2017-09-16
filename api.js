const path = require('path');
const fs = require('hexo-fs');
const yml = require('js-yaml');
const deepAssign = require('deep-assign');
const extend = require('extend');
const updateAny = require('./update');

const updatePage = updateAny.bind(null, 'Page');
const update = updateAny.bind(null, 'Post');
const deploy = require('./deploy');

module.exports = (app, hexo) => {
  function addIsDraft(post) {
    post.isDraft = post.source.indexOf('_draft') === 0;
    post.isDiscarded = post.source.indexOf('_discarded') === 0;
    return post;
  }

  function tagsCategoriesAndMetadata() {
    const cats = {};
    const tags = {};
    hexo.model('Category').forEach((cat) => {
      cats[cat._id] = cat.name;
    });
    hexo.model('Tag').forEach((tag) => {
      tags[tag._id] = tag.name;
    });
    return {
      categories: cats,
      tags,
      metadata: Object.keys(hexo.config.metadata || {}),
    };
  }

  // reads admin panel settings from _admin-config.yml
  // or writes it if it does not exist
  function getSettings() {
    const path = `${hexo.base_dir}_admin-config.yml`;
    if (!fs.existsSync(path)) {
      hexo.log.d('admin config not found, creating one');
      fs.writeFile(`${hexo.base_dir}_admin-config.yml`, '');
      return {};
    }
    const settings = yml.safeLoad(fs.readFileSync(path));

    if (!settings) return {};
    return settings;
  }

  function remove(id, body, res) {
    const post = hexo.model('Post').get(id);
    if (!post) return res.send(404, 'Post not found');
    const newSource = `_discarded/${post.source.slice('_drafts'.length)}`;
    update(id, { source: newSource }, (err, post) => {
      if (err) {
        return res.send(400, err);
      }
      res.done(addIsDraft(post));
    }, hexo);
  }

  function publish(id, body, res) {
    const post = hexo.model('Post').get(id);
    if (!post) return res.send(404, 'Post not found');
    const newSource = `_posts/${post.source.slice('_drafts/'.length)}`;
    update(id, { source: newSource }, (err, post) => {
      if (err) {
        return res.send(400, err);
      }
      res.done(addIsDraft(post));
    }, hexo);
  }

  function unpublish(id, body, res) {
    const post = hexo.model('Post').get(id);
    if (!post) return res.send(404, 'Post not found');
    const newSource = `_drafts/${post.source.slice('_posts/'.length)}`;
    update(id, { source: newSource }, (err, post) => {
      if (err) {
        return res.send(400, err);
      }
      res.done(addIsDraft(post));
    }, hexo);
  }

  function rename(id, body, res) {
    let model = 'Post';
    let post = hexo.model('Post').get(id);
    if (!post) {
      model = 'Page';
      post = hexo.model('Page').get(id);
      if (!post) return res.send(404, 'Post not found');
    }
    // remember old path w/o index.md
    let oldPath = post.full_source;
    oldPath = oldPath.slice(0, oldPath.indexOf('index.md'));

    updateAny(model, id, { source: body.filename }, (err, post) => {
      if (err) {
        return res.send(400, err);
      }
      hexo.log.d(`renamed ${model.toLowerCase()} to ${body.filename}`);

      // remove old folder if empty
      if (model === 'Page' && fs.existsSync(oldPath)) {
        if (fs.readdirSync(oldPath).length === 0) {
          fs.rmdirSync(oldPath);
          hexo.log.d('removed old page\'s empty directory');
        }
      }

      res.done(addIsDraft(post));
    }, hexo);
  }

  const use = (path, fn) => {
    app.use(`${hexo.config.root}admin/api/${path}`, (req, res) => {
      const done = (val) => {
        if (!val) {
          res.statusCode = 204;
          return res.end('');
        }
        res.setHeader('Content-type', 'application/json');
        res.end(JSON.stringify(val, (k, v) => {
          // tags and cats have posts reference resulting in circular json..
          if (k === 'tags' || k === 'categories') {
            // convert object to simple array
            return v.toArray ? v.toArray().map(obj => obj.name) : v;
          }
          return v;
        }));
      };
      res.done = done;
      res.send = (num, data) => {
        res.statusCode = num;
        res.end(data);
      };
      fn(req, res);
    });
  };

  use('tags-categories-and-metadata', (req, res) => {
    res.done(tagsCategoriesAndMetadata());
  });

  use('settings/list', (req, res) => {
    res.done(getSettings());
  });

  use('settings/set', (req, res, next) => {
    if (req.method !== 'POST') return next();
    if (!req.body.name) {
      console.log('no name');
      hexo.log.d('no name');
      return res.send(400, 'No name given');
    }
    // value is capable of being false
    if (typeof req.body.value === 'undefined') {
      console.log('no value');
      hexo.log.d('no value');
      return res.send(400, 'No value given');
    }

    const name = req.body.name;
    const value = req.body.value;

    // no addOptions means we just want to set a single value in the admin options
    // usually for text-based option setting
    const addedOptsExist = !!req.body.addedOptions;

    let settings = getSettings();
    // create options section if it doesn't exist, ie. first time changing settings
    if (!settings.options) {
      settings.options = {};
    }

    settings.options[name] = value;

    const addedOptions = addedOptsExist ? req.body.addedOptions : 'no additional options';
    if (addedOptsExist) {
      settings = deepAssign(settings, addedOptions);
    }
    hexo.log.d('set', name, '=', value, 'with', JSON.stringify(addedOptions));

    fs.writeFileSync(`${hexo.base_dir}_admin-config.yml`, yml.safeDump(settings));
    res.done({
      updated: `Successfully updated ${name} = ${value}`,
      settings,
    });
  });

  use('pages/list', (req, res) => {
    const page = hexo.model('Page');
    res.done(page.toArray().map(addIsDraft));
  });

  use('pages/new', (req, res, next) => {
    if (req.method !== 'POST') return next();
    if (!req.body) {
      return res.send(400, 'No page body given');
    }
    if (!req.body.title) {
      return res.send(400, 'No title given');
    }

    hexo.post.create({ title: req.body.title, layout: 'page', date: new Date() })
      .error((err) => {
        console.error(err, err.stack);
        return res.send(500, 'Failed to create page');
      })
      .then((file) => {
        const source = file.path.slice(hexo.source_dir.length);

        hexo.source.process([source]).then(() => {
          const page = hexo.model('Page').findOne({ source });
          res.done(addIsDraft(page));
        });
      });
  });


  use('pages/', (req, res, next) => {
    let url = req.url;
    console.log('in pages', url);
    if (url[url.length - 1] === '/') {
      url = url.slice(0, -1);
    }
    const parts = url.split('/');
    const last = parts[parts.length - 1];
    // not currently used?
    if (last === 'remove') {
      return remove(parts[parts.length - 2], req.body, res);
    }
    if (last === 'rename') {
      return remove(parts[parts.length - 2], req.body, res);
    }

    const id = last;
    if (id === 'pages' || !id) return next();
    if (req.method === 'GET') {
      const page = hexo.model('Page').get(id);
      if (!page) return next();
      return res.done(addIsDraft(page));
    }

    if (!req.body) {
      return res.send(400, 'No page body given');
    }

    updatePage(id, req.body, (err, page) => {
      if (err) {
        return res.send(400, err);
      }
      res.done({
        page: addIsDraft(page),
        tagsCategoriesAndMetadata: tagsCategoriesAndMetadata(),
      });
    }, hexo);
  });

  use('posts/list', (req, res) => {
    const post = hexo.model('Post');
    res.done(post.toArray().map(addIsDraft));
  });

  use('posts/new', (req, res, next) => {
    if (req.method !== 'POST') return next();
    if (!req.body) {
      return res.send(400, 'No post body given');
    }
    if (!req.body.title) {
      return res.send(400, 'No title given');
    }

    const postParameters = { title: req.body.title, layout: 'draft', date: new Date(), author: hexo.config.author };
    extend(postParameters, hexo.config.metadata || {});
    hexo.post.create(postParameters)
      .error((err) => {
        console.error(err, err.stack);
        return res.send(500, 'Failed to create post');
      })
      .then((file) => {
        const source = file.path.slice(hexo.source_dir.length);
        hexo.source.process([source]).then(() => {
          const post = hexo.model('Post').findOne({ source: source.replace(/\\/g, '\/') });
          res.done(addIsDraft(post));
        });
      });
  });

  use('posts/', (req, res, next) => {
    let url = req.url;
    if (url[url.length - 1] === '/') {
      url = url.slice(0, -1);
    }
    const parts = url.split('/');
    const last = parts[parts.length - 1];
    if (last === 'publish') {
      return publish(parts[parts.length - 2], req.body, res);
    }
    if (last === 'unpublish') {
      return unpublish(parts[parts.length - 2], req.body, res);
    }
    if (last === 'remove') {
      return remove(parts[parts.length - 2], req.body, res);
    }
    if (last === 'rename') {
      return rename(parts[parts.length - 2], req.body, res);
    }

    const id = last;
    if (id === 'posts' || !id) return next();
    if (req.method === 'GET') {
      const post = hexo.model('Post').get(id);
      if (!post) return next();
      return res.done(addIsDraft(post));
    }

    if (!req.body) {
      return res.send(400, 'No post body given');
    }

    update(id, req.body, (err, post) => {
      if (err) {
        return res.send(400, err);
      }
      res.done({
        post: addIsDraft(post),
        tagsCategoriesAndMetadata: tagsCategoriesAndMetadata(),
      });
    }, hexo);
  });

  use('images/upload', (req, res, next) => {
    hexo.log.d('uploading image');
    if (req.method !== 'POST') return next();
    if (!req.body) {
      return res.send(400, 'No post body given');
    }
    if (!req.body.data) {
      return res.send(400, 'No data given');
    }
    const settings = getSettings();

    let imagePath = '/images';
    let imagePrefix = 'pasted-';
    let askImageFilename = false;
    let overwriteImages = false;
    // check for image settings and set them if they exist
    if (settings.options) {
      askImageFilename = !!settings.options.askImageFilename;
      overwriteImages = !!settings.options.overwriteImages;
      imagePath = settings.options.imagePath ? settings.options.imagePath : imagePath;
      imagePrefix = settings.options.imagePrefix ? settings.options.imagePrefix : imagePrefix;
    }

    let msg = 'upload successful';
    let i = 0;
    while (fs.existsSync(path.join(hexo.source_dir, imagePath, `${imagePrefix + i}.png`))) {
      i += 1;
    }
    let filename = path.join(`${imagePrefix + i}.png`);
    if (req.body.filename) {
      let givenFilename = req.body.filename;
      // check for png ending, add it if not there
      const index = givenFilename.toLowerCase().indexOf('.png');
      if (index < 0 || index !== givenFilename.length - 4) {
        givenFilename += '.png';
      }
      hexo.log.d('trying custom filename', givenFilename);
      if (fs.existsSync(path.join(hexo.source_dir, imagePath, givenFilename))) {
        if (overwriteImages) {
          hexo.log.d('file already exists, overwriting');
          msg = 'overwrote existing file';
          filename = givenFilename;
        } else {
          hexo.log.d('file already exists, using', filename);
          msg = 'filename already exists, renamed';
        }
      } else {
        filename = givenFilename;
      }
    }

    filename = path.join(imagePath, filename);
    const outpath = path.join(hexo.source_dir, filename);

    const dataURI = req.body.data.slice('data:image/png;base64,'.length);
    const buf = new Buffer(dataURI, 'base64');
    hexo.log.d(`saving image to ${outpath}`);
    fs.writeFile(outpath, buf, (err) => {
      if (err) {
        console.log(err);
      }
      hexo.source.process().then(() => {
        res.done({
          src: path.join(hexo.config.root + filename),
          msg,
        });
      });
    });
  });

  use('deploy', (req, res, next) => {
    if (req.method !== 'POST') return next();
    if (!hexo.config.admin || !hexo.config.admin.deployCommand) {
      return res.done({ error: 'Config value "admin.deployCommand" not found' });
    }
    try {
      deploy(hexo.config.admin.deployCommand, req.body.message, (err, result) => {
        console.log('res', err, result);
        if (err) {
          return res.done({ error: err.message || err });
        }
        res.done(result);
      });
    } catch (e) {
      console.log('EEE', e);
      res.done({ error: e.message });
    }
  });
};
