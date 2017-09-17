import React, { Component } from 'react';

// const DataFetcher = require('./data-fetcher');
import { getPost, getSettings } from '../api/dev';
import Rendered from '../rendered';


const marked = require('marked');
// const Editor = require('./editor');
// const _ = require('lodash');
const moment = require('moment');
const Router = require('react-router');
// const Confirm = require('./confirm');

// const confirm = (message, options = {}) => (
//   <Confirm message={message} options={options} />
// );


// const Post = React.createClass({
// mixins: [DataFetcher(params => ({
//   post: api.post(params.postId),
//   tagsCategoriesAndMetadata: api.tagsCategoriesAndMetadata(),
//   settings: api.settings(),
// }))],

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updated: moment(),
    };
  }

  componentDidMount() {
    const { postId } = this.props.match.params;
    getPost(postId).then((data) => {
      console.log(data);
      this.setState({
        updated: moment(),
        data,
      });
    });

    getSettings().then((settings) => {
      this.setState({
        settings,
      });
    });
  }

  handleChange(update) {
    const now = moment();
    const { postId } = this.props.match.params;

    getPost(postId, update).then((data) => {
      const state = {
        tagsCategoriesAndMetadata: data.tagsCategoriesAndMetadata,
        post: data.post,
        updated: now,
        author: data.post.author,
      };
      for (let i = 0; i < data.tagsCategoriesAndMetadata.metadata.length; i++) {
        const name = data.tagsCategoriesAndMetadata.metadata[i];
        state[name] = data.post[name];
      }
      this.setState(state);
    });
  }

  handleChangeContent(text) {
    if (text === this.state.raw) {
      return;
    }
    this.setState({
      raw: text,
      updated: null,
      rendered: marked(text),
    });
    this._post({ _content: text });
  }

  handleChangeTitle(title) {
    if (title === this.state.title) {
      return;
    }
    this.setState({ title });
    this._post({ title });
  }

  handlePublish() {
    if (!this.state.post.isDraft) return;
    api.publish(this.state.post._id).then((post) => {
      this.setState({ post });
    });
  }

  handleUnpublish() {
    if (this.state.post.isDraft) return;
    api.unpublish(this.state.post._id).then((post) => {
      this.setState({ post });
    });
  }

  handleRemove() {
    const self = this;
    return confirm('Delete this post?', {
      description: 'This operation will move current draft into source/_discarded folder.',
      confirmLabel: 'Yes',
      abortLabel: 'No',
    }).then(() => {
      api.remove(self.state.post._id).then(
        Router.transitionTo('posts'),
      );
    });
  }

  dataDidLoad(name, data) {
    if (name !== 'post') return;
    const parts = data.raw.split('---');
    const _slice = parts[0] === '' ? 2 : 1;
    const raw = parts.slice(_slice).join('---').trim();
    this.setState({
      title: data.title,
      initialRaw: raw,
      raw,
      rendered: data.content,
    });
  }

  render() {
    const { data, settings } = this.state;
    if (!data || !settings) {
      return <span>Loading Post Data, Please wait...</span>;
    }
    return (
      <Rendered text={data.raw} />
    );

    // return Editor({
    //   post: this.state.post,
    //   raw: this.state.initialRaw,
    //   updatedRaw: this.state.raw,
    //   wordCount: this.state.raw ? this.state.raw.split(' ').length : 0,
    //   isDraft: post.isDraft,
    //   updated: this.state.updated,
    //   title: this.state.title,
    //   rendered: this.state.rendered,
    //   onChange: this.handleChange,
    //   onChangeContent: this.handleChangeContent,
    //   onChangeTitle: this.handleChangeTitle,
    //   onPublish: this.handlePublish,
    //   onUnpublish: this.handleUnpublish,
    //   onRemove: this.handleRemove,
    //   tagsCategoriesAndMetadata: this.state.tagsCategoriesAndMetadata,
    //   adminSettings: settings,
    // });
  }
}

export default Post;
