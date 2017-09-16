import React, { Component } from 'react';
import { newPost } from './api';

class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      loading: true,
      text: 'Your Post Title', // @TODO i18n
    };
  }

  onKeydown(e) {
    if (e.key === 'Enter') {
      this.onSubmit(e);
    }
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true, showing: false });
    newPost(this.state.text).then((post) => {
      this.setState({ showing: false, text: 'Untitled' });
      this.props.onNew(post);
    }, (err) => {
      console.error('Failed! to make post', err);
    });
  }


  onChange(e) {
    this.setState({
      text: e.target.value,
    });
  }

  focusTextInput() {
    this.textInput.focus();
  }

  handleBlur() {
    if (this.state.showing) {
      this.toggleInput(false);
    }
  }

  toggleInput(showing) {
    this.setState(() => ({ showing }));
  }

  render() {
    if (!this.state.showing) {
      return (
        <div
          className="new-post"
          onClick={() => this.toggleInput(true)}
          role="button"
          aria-hidden
        >
          <div className="new-post_button">
            <i className="fa fa-plus" />{' '}
            New Post
          </div>
        </div>
      );
    }

    return (
      <div
        className="new-post"
      >
        <input
          className="new-post_input"
          value={this.state.text}
          onBlur={() => this.handleBlur()}
          onKeyPress={e => this.onKeydown(e)}
          onChange={() => this.onChange()}
        />
        <i
          className="fa fa-check-circle new-post_ok"
          onMouseDown={e => this.onSubmit(e)}
          role="button"
          aria-hidden
        />
        <i
          className="fa fa-times-circle new-post_cancel"
          onMouseDown={() => this.toggleInput(false)}
          role="button"
          aria-hidden
        />
      </div>);
  }
}

module.exports = NewPost;
