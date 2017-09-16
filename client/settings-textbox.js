import React from 'react';

const PT = React.PropTypes;
const api = require('./api');

const SettingsTextbox = React.createClass({
  propTypes: {
    name: PT.string.isRequired,
    defaultValue: PT.string.isRequired,
    label: PT.string.isRequired,
  },

  getInitialState() {
    return {
      value: this.props.defaultValue,
    };
  },

  componentDidMount() {
    const name = this.props.name;
    const defaultValue = this.props.defaultValue;
    api.settings().then((settings) => {
      let value;
      if (!settings.options) {
        value = defaultValue;
      } else if (!settings.options[name]) {
        value = defaultValue;
      } else {
        value = settings.options[name];
      }
      this.setState({ value });
    });
  },

  handleChange(e) {
    const name = this.props.name;
    const value = e.target.value;
    api.setSetting(name, value).then((result) => {
      console.log(result.updated);
      this.setState({
        value: result.settings.options[name],
      });
    });
  },

  render() {
    return (
      <p>
        <b>{this.props.label}:  </b>
        <input
          type="text"
          onChange={this.handleChange}
          value={this.state.value}
        />
      </p>
    );
  },
});

module.exports = SettingsTextbox;
