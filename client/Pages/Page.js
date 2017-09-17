
const DataFetcher = require('./data-fetcher');
const api = require('./api');
const React = require('react/addons');

const cx = React.addons.classSet;
const Promise = require('es6-promise').Promise;
const marked = require('marked');
const Editor = require('./editor');
const _ = require('lodash');
const moment = require('moment');

const Page = React.createClass({
  mixins: [DataFetcher(params => ({
    page: api.page(params.pageId),
    settings: api.settings(),
    // tagsCategoriesAndMetadata: api.tagsCategoriesAndMetadata()
  }))],

  getInitialState() {
    return {
      updated: moment(),
    };
  },

  componentDidMount() {
    this._page = _.debounce((update) => {
      const now = moment();
      api.page(this.props.params.pageId, update).then(() => {
        this.setState({
          updated: now,
        });
      });
    }, 1000, { trailing: true, loading: true });
  },

  handleChange(update) {
    const now = moment();
    api.page(this.props.params.pageId, update).then((data) => {
      this.setState({
        page: data.page,
        updated: now,
      });
    });
  },

  handleChangeContent(text) {
    if (text === this.state.raw) {
      return;
    }
    this.setState({
      raw: text,
      updated: null,
      rendered: marked(text),
    });
    this._page({ _content: text });
  },

  handleChangeTitle(title) {
    if (title === this.state.title) {
      return;
    }
    this.setState({ title });
    this._page({ title });
  },

  handlePublish() {
    if (!this.state.page.isDraft) return;
    api.publish(this.state.page._id).then((page) => {
      this.setState({ page });
    });
  },

  handleUnpublish() {
    if (this.state.page.isDraft) return;
    api.unpublish(this.state.page._id).then((page) => {
      this.setState({ page });
    });
  },

  dataDidLoad(name, data) {
    if (name !== 'page') return;
    const parts = data.raw.split('---');
    const _slice = parts[0] === '' ? 2 : 1;
    const raw = parts.slice(_slice).join('---').trim();
    this.setState({
      title: data.title,
      initialRaw: raw,
      raw,
      rendered: data.content,
    });
  },

  render() {
    const page = this.state.page;
    const settings = this.state.settings;
    if (!page || !settings) {
      return <span>Loading...</span>;
    }
    return Editor({
      isPage: true,
      post: this.state.page,
      raw: this.state.initialRaw,
      wordCount: this.state.raw ? this.state.raw.split(' ').length : 0,
      isDraft: page.isDraft,
      updated: this.state.updated,
      title: this.state.title,
      rendered: this.state.rendered,
      onChange: this.handleChange,
      onChangeContent: this.handleChangeContent,
      onChangeTitle: this.handleChangeTitle,
      onPublish: this.handlePublish,
      onUnpublish: this.handleUnpublish,
      tagsCategoriesAndMetadata: this.state.tagsCategoriesAndMetadata,
      adminSettings: settings,
    });
  },
});

module.exports = Page;
