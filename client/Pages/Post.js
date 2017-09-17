import React, { Component } from 'react';

import { EditorState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';

// const DataFetcher = require('./data-fetcher');
import { getPost, getSettings } from '../api/dev';

// import Editor from '../editor';

// import Rendered from '../rendered';


// const marked = require('marked');

// const _ = require('lodash');
const moment = require('moment');
// const Router = require('react-router');
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

const plugins = [
  createMarkdownShortcutsPlugin(),
];

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updated: moment(),
      editorState: EditorState.createEmpty(),
    };
  }

  componentDidMount() {
    const { postId } = this.props.match.params; // eslint-disable-line
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

  handleChange(editorState) {
    // const now = moment();
    this.setState({ editorState });
    // const { postId } = this.props.match.params;

    // getPost(postId, update).then((data) => {
    //   const state = {
    //     tagsCategoriesAndMetadata: data.tagsCategoriesAndMetadata,
    //     post: data.post,
    //     updated: now,
    //     author: data.post.author,
    //   };
    //   for (let i = 0; i < data.tagsCategoriesAndMetadata.metadata.length; i += 1) {
    //     const name = data.tagsCategoriesAndMetadata.metadata[i];
    //     state[name] = data.post[name];
    //   }
    //   this.setState(state);
    // });
  }

  // handleKeyCommand(command, editorState) {
  //   const newState = RichUtils.handleKeyCommand(editorState, command);
  //   if (newState) {
  //     this.handleChange(newState);
  //     return 'handled';
  //   }
  //   return 'not-handled';
  // }

  // handleChangeContent(text) {
  //   if (text === this.state.raw) {
  //     return;
  //   }
  //   this.setState({
  //     raw: text,
  //     updated: null,
  //     rendered: marked(text),
  //   });
  //   this._post({ _content: text });
  // }
  //
  // handleChangeTitle(title) {
  //   if (title === this.state.title) {
  //     return;
  //   }
  //   this.setState({ title });
  //   this._post({ title });
  // }
  //
  // handlePublish() {
  //   if (!this.state.post.isDraft) return;
  //   publish(this.state.post._id).then((post) => {
  //     this.setState({ post });
  //   });
  // }
  //
  // handleUnpublish() {
  //   if (this.state.post.isDraft) return;
  //   unpublish(this.state.post._id).then((post) => {
  //     this.setState({ post });
  //   });
  // }
  //
  // handleRemove() {
  //   const self = this;
  //   return confirm('Delete this post?', {
  //     description: 'This operation will move current draft into source/_discarded folder.',
  //     confirmLabel: 'Yes',
  //     abortLabel: 'No',
  //   }).then(() => {
  //     remove(self.state.post._id).then(
  //       Router.transitionTo('posts'),
  //     );
  //   });
  // }
  //
  // dataDidLoad(name, data) {
  //   if (name !== 'post') return;
  //   const parts = data.raw.split('---');
  //   const _slice = parts[0] === '' ? 2 : 1;
  //   const raw = parts.slice(_slice).join('---').trim();
  //   this.setState({
  //     title: data.title,
  //     initialRaw: raw,
  //     raw,
  //     rendered: data.content,
  //   });
  // }

  render() {
    const { data, settings, editorState } = this.state;
    if (!data || !settings) {
      return <span>Loading Post Data, Please wait...</span>;
    }

    // handleKeyCommand={(command, state) => this.handleKeyCommand(command, state)}
    return (
      <Editor
        editorState={editorState}
        onChange={state => this.handleChange(state)}
        plugins={plugins}
      />
    );

    /*
    return (
      <Editor
        // post={this.state.post}
        raw={raw}
        updatedRaw={raw}
        wordCount={0} // @TODO: Count Chinese Words
        isDraft={false}
        updated={updated}
        title={'title'}
        // rendered={rendered}

        onChange={this.handleChange}
        onChangeContent={this.handleChangeContent}
        onChangeTitle={this.handleChangeTitle}
        onPublish={this.handlePublish}
        onUnpublish={this.handleUnpublish}
        onRemove={this.handleRemove}
        // tagsCategoriesAndMetadata={this.state.tagsCategoriesAndMetadata}
        adminSettings={settings}
      />
    );
    */
  }
}

export default Post;
