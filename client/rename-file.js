
const path = require('path');
const React = require('react/addons');

const PT = React.PropTypes;
const api = require('./api');

const RenameFile = React.createClass({
  propTypes: {
    post: PT.object,
    handlePreviewLink: PT.func,
  },

  getInitialState() {
    return {
      filename: '',
      editing: false,
      editingName: '',
    };
  },

  componentDidMount() {
    const filename = this.props.post.source;
    this.setState({
      filename,
      editingName: filename,
    });
  },

  toggleEditing() {
    this.setState({
      editing: !this.state.editing,
      editingName: this.state.filename,
    });
  },

  handleEditChange(e) {
    this.setState({ editingName: e.target.value });
  },

  handleRenameFile(e) {
    const postId = this.props.post._id;
    const editingName = this.state.editingName;
    api.renamePost(postId, editingName).then((result) => {
      if (!result) {
        console.log('error renaming file.');
        this.toggleEditing();
        return;
      }
      console.log(`successfully renamed file to ${editingName}`);

      const url = window.location.pathname.split('/');
      const rootPath = url.slice(0, url.indexOf('admin')).join('/');
      const previewLink = path.join(rootPath, result.path);

      this.setState({ filename: editingName, editing: false },
        this.props.handlePreviewLink(previewLink));
    });
  },

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      return this.handleRenameFile();
    }
    // esccape key
    if (e.keyCode === 27) {
      return this.toggleEditing();
    }
  },

  render() {
    return (
      <div className="fileRename">
        {!this.state.editing &&
          <div
            className="fileRename_display"
            title="Click to rename"
            onClick={this.toggleEditing}
          >
            {this.state.filename}
          </div>}
        {this.state.editing && <span>
          <input
            type="text"
            onChange={this.handleEditChange}
            onKeyDown={this.handleKeyPress}
            defaultValue={this.state.editingName}
          />
          <span className="fileRename_buttons">
            <i
              title="Cancel"
              className="fa fa-times"
              onClick={this.toggleEditing}
            />
            <i
              title="Rename File"
              className="fa fa-check"
              onClick={this.handleRenameFile}
            />
          </span></span>}
      </div>
    );
  },
});

module.exports = RenameFile;
