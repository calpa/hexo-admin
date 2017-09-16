import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getSettings, setSetting } from './api';

// For now, hexo-admin is using restful to handle the request
// @TODO: Use redux store to handle the state
class SettingsCheckbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  componentDidMount() {
    const name = this.props.name;
    getSettings().then((settings) => {
      console.log(settings);
      let checked;
      if (!settings.options) {
        checked = false;
      } else {
        checked = !!settings.options[name];
      }
      this.setState({ checked });
    }).catch((err) => {
      console.error(err);
    });
  }

  handleChange(e) {
    const name = this.props.name;
    const addedOptions = e.target.checked ? this.props.enableOptions
      : this.props.disableOptions;
    const value = e.target.checked;
    setSetting(name, value, addedOptions).then((result) => {
      console.log(result.updated);
      this.setState({
        checked: result.settings.options[name],
      });
    });
  }

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
  }
}

SettingsCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  style: PropTypes.object, // eslint-disable-line
  enableOptions: PropTypes.object, // eslint-disable-line
  disableOptions: PropTypes.object, // eslint-disable-line
  onClick: PropTypes.func, // eslint-disable-line
};

export default SettingsCheckbox;
