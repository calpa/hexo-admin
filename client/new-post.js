import React from 'react';
import PropTypes from 'prop-types';

const api = require('./api');

const NewPost = React.createClass({
  getInitialState() {
    return {
      showing: false,
      loading: true,
      text: 'Untitled',
    };
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.state.showing && !prevState.showing) {
      const node = this.refs.input.getDOMNode();
      node.focus();
      node.selectionStart = 0;
      node.selectionEnd = node.value.length;
    }
  },

  _onKeydown(e) {
    if (e.key === 'Enter') {
      this._onSubmit(e);
    }
  },

  _onShow() {
    this.setState({ showing: true });
  },

  _onBlur() {
    if (this.state.showing) {
      this._onCancel();
    }
  },

  _onSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true, showing: false });
    api.newPost(this.state.text).then((post) => {
      this.setState({ showing: false, text: 'Untitled' });
      this.props.onNew(post);
    }, (err) => {
      console.error('Failed! to make post', err);
    });
  },

  _onCancel() {
    this.setState({ showing: false });
  },

  _onChange(e) {
    this.setState({
      text: e.target.value,
    });
  },

  render() {
    if (!this.state.showing) {
      return (<div className="new-post" onClick={this._onShow}>
        <div className="new-post_button">
          <i className="fa fa-plus" />{' '}
          New Post
        </div>
      </div>);
    }

    return (<div className="new-post">
      <input
        className="new-post_input"
        ref="input"
        value={this.state.text}
        onBlur={this._onBlur}
        onKeyPress={this._onKeydown}
        onChange={this._onChange}
      />
      <i
        className="fa fa-check-circle new-post_ok"
        onMouseDown={this._onSubmit}
      />
      <i
        className="fa fa-times-circle new-post_cancel"
        onMouseDown={this._onCancel}
      />
    </div>);
  },
});

NewPost.propTypes = {
  onNew: PropTypes.func,
};

module.exports = NewPost;
