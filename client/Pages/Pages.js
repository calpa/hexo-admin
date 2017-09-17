
const React = require('react/addons');

const cx = React.addons.classSet;
const Link = require('react-router').Link;
const Router = require('react-router');
const _ = require('lodash');
const moment = require('moment');
const SinceWhen = require('./since-when');

const Rendered = require('./rendered');
const DataFetcher = require('./data-fetcher');
const Newpage = require('./new-page');
const api = require('./api');

const Pages = React.createClass({
  mixins: [DataFetcher(params => ({
    pages: api.pages().then(pages =>
      _.sortBy(pages, ['isDraft', 'date']).reverse(),
    ),
  }))],

  getInitialState() {
    return {
      selected: 0,
    };
  },

  _onNew(page) {
    const pages = this.state.pages.slice();
    pages.unshift(page);
    this.setState({ pages });
    Router.transitionTo('page', { pageId: page._id });
  },

  goTo(id, e) {
    if (e) {
      e.preventDefault();
    }
    Router.transitionTo('page', { pageId: id });
  },

  render() {
    if (!this.state.pages) {
      return <div className="pages">Loading...</div>;
    }
    const current = this.state.pages[this.state.selected] || {};
    const url = window.location.href.replace(/^.*\/\/[^\/]+/, '').split('/');
    const rootPath = url.slice(0, url.indexOf('admin')).join('/');
    return (<div className="posts">
      <ul className="posts_list">
        <Newpage onNew={this._onNew} />
        {
          this.state.pages.map((page, i) =>
            (<li
              key={page._id}
              className={cx({
                posts_post: true,
                'posts_post--draft': page.isDraft,
                'posts_post--selected': i === this.state.selected,
              })}
              onDoubleClick={this.goTo.bind(null, page._id)}
              onClick={this.setState.bind(this, { selected: i }, null)}
            >
              <span className="posts_post-title">
                {page.title}
              </span>
              <span className="posts_post-date">
                {moment(page.date).format('MMM Do YYYY')}
              </span>
              <a className="posts_perma-link" target="_blank" href={`${rootPath}/${page.path}`}>
                <i className="fa fa-link" />
              </a>
              <Link className="posts_edit-link" to="page" pageId={page._id}>
                <i className="fa fa-pencil" />
              </Link>
            </li>),
          )
        }
      </ul>
      <div className={cx({
        posts_display: true,
        'posts_display--draft': current.isDraft,
      })}
      >
        {current.isDraft && <div className="posts_draft-message">Draft</div>}
        <Rendered
          ref="rendered"
          className="posts_content"
          text={current.content}
        />
      </div>
    </div>);
  },
});

module.exports = Pages;
