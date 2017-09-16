import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// import { getPosts } from './api';
import { getPosts } from './api/dev';

import NewPost from './new-post';

// import DataFetcher from './data-fetcher';

// const path = require('path');

// const cx = React.addons.classSet;
// const Link = require('react-router').Link;
// const Router = require('react-router');
// const _ = require('lodash');
const moment = require('moment');
// const SinceWhen = require('./since-when');

const Rendered = require('./rendered');

// const NewPost = require('./new-post');
// const api = require('./api');

// mixins: [DataFetcher(params => ({
//   pages: api.pages().then(pages =>
//     _.sortBy(pages, ['isDraft', 'date']).reverse(),
//   ),
// }))],

const DefaultMessage = (
  <div className="posts">Loading Posts...</div>
);

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    };
  }

  componentWillMount() {
    getPosts().then((posts) => {
      console.log(posts);
      this.setState(() => ({ posts }));
    });
  }

  handleNew(post) {
    const posts = this.state.posts.slice();
    posts.unshift(post);
    this.setState({ posts });
    // Router.transitionTo('post', { postId: post._id });
  }

  // goTo(id, e) {
  //   if (e) {
  //     e.preventDefault();
  //   }
  //   Router.transitionTo('post', { postId: id });
  // }

  render() {
    const { posts, selected } = this.state;

    if (!posts) {
      return DefaultMessage;
    }
    const current = posts[selected] || {};
    // const url = window.location.href.replace(/^.*\/\/[^/]+/, '').split('/');
    // const rootPath = url.slice(0, url.indexOf('admin')).join('/');
    return (
      <div className="posts">
        <ul className="posts_list">
          <NewPost onNew={this.handleNew} />
          {
            posts.map((post, i) =>
              (
                <li
                  aria-hidden
                  key={post._id}
                  className={({
                    posts_post: true,
                    'posts_post--draft': post.isDraft,
                    'posts_post--selected': i === this.state.selected,
                  })}
                  onDoubleClick={() => this.goTo(post._id)}
                  onClick={() => this.setState({ selected: i })}
                  role="button"
                >
                  <span className="posts_post-title">
                    {post.title}
                  </span>
                  <span className="posts_post-date">
                    {moment(post.date).format('MMM Do YYYY')}
                  </span>
                  <a
                    className="posts_perma-link"
                    target="_blank"
                    // href={path.join(rootPath, '/', post.path)}
                  >
                    <i className="fa fa-link" />
                  </a>
                  <Link className="posts_edit-link" to={`/post/${post._id}`} >
                    <i className="fa fa-pencil" />
                  </Link>
                </li>),
            )
          }
        </ul>
        <div>
          {/* <div className={({
            posts_display: true,
            'posts_display--draft': current.isDraft,
          })} */}
          {/* {current.isDraft && <div className="posts_draft-message">Draft</div>} */}
          <Rendered
            // ref="rendered"
            className="posts_content"
            text={current.content}
          />
        </div>
      </div>);
  }
}

export default Posts;
