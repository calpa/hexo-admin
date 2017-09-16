import React from 'react';

const PT = React.PropTypes;
const api = require('./api');

const SettingsCheckbox = React.createClass({
  propTypes: {
    name: PT.string.isRequired,
    label: PT.string.isRequired,
    style: PT.object,
    enableOptions: PT.object,
    disableOptions: PT.object,
    onClick: PT.func,
  },

  getInitialState() {
    return {
      checked: false,
    };
  },

  componentDidMount() {
    const name = this.props.name;
    api.settings().then((settings) => {
      let checked;
      if (!settings.options) {
        checked = false;
      } else {
        checked = !!settings.options[name];
      }
      this.setState({ checked });
    });
  },

  handleChange(e) {
    const name = this.props.name;
    const addedOptions = e.target.checked ? this.props.enableOptions
      : this.props.disableOptions;
    const value = e.target.checked;
    api.setSetting(name, value, addedOptions).then((result) => {
      console.log(result.updated);
      this.setState({
        checked: result.settings.options[name],
      });
    });
  },

  render() {
    return (
      <p style={this.props.style}>
        <label>
          <input
            checked={this.state.checked}
            type="checkbox"
            onChange={this.handleChange}
            onClick={this.props.onClick}
          />
          {this.props.label}
        </label>
      </p>
    );
  },
});

module.exports = SettingsCheckbox;
