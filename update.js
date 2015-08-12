var fs = require('fs'),
  path = require('path'),
  moment = require('moment'),
  hfm = require('hexo-front-matter'),
  file = require('hexo-fs'),
  extend = require('extend');
//  yfm = util.yfm,
//  escape = util.escape;

/**
 * Updates a post.
 *
 * @method update
 * @param {str} model the type of model being updated
 * @param {Object} post a post model
 * @param {Object} update attributes to update
 * @param {Function} callback
 */
module.exports = function (model, id, update, callback, hexo) {
  var post = hexo.model(model).get(id)
  if (!post) {
    return callback('Post not found');
  }
  var config = hexo.config,
    slug = post.slug = hfm.escape(post.slug || post.title, config.filename_case),
    layout = post.layout = (post.layout || config.default_layout).toLowerCase(),
    date = post.date = post.date ? moment(post.date) : moment();

  var split = hfm.split(post.raw),
    frontMatter = split.data
    compiled = hfm.parse([frontMatter, '---', split.content].join('\n'));

  var preservedKeys = ['title', 'date', 'tags', 'categories', '_content'];
  var prev_full = post.full_source,
    full_source = prev_full;
  if (update.source && update.source !== post.source) {
    //TODO post.full_source only readable
    full_source = hexo.source_dir + update.source
  }

  preservedKeys.forEach(function (attr) {
    if (attr in update) {
      compiled[attr] = update[attr]
    }
  });
  compiled.date = moment(compiled.date).toDate()

  delete update._content

  var raw = hfm.stringify(compiled);
  update.raw = raw
  update.updated = moment()

  //for (var name in update) {
  //  post[name] = update[name];
  //}
  extend(post, update)

  post.save(function () {
  //  console.log(post.full_source, post.source)
    file.writeFile(full_source, raw, function(err){
      if (err) return callback(err);

      if (full_source !== prev_full) {
        fs.unlinkSync(prev_full)
      }
      hexo.source.process([post.source]).then(function () {
  //      console.log(post.full_source, post.source)
        callback(null, hexo.model(model).get(id));
      });
    });
  });
}