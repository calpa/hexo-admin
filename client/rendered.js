import React from 'react';
import PropTypes from 'prop-types';

const Rendered = ({ text }) => (
  <div
    className="post-content"
  >
    123
  </div>
);

Rendered.propTypes = {
  text: PropTypes.string,
};

Rendered.defaultProps = {
  text: 'Nothing Yet...',
};

module.exports = Rendered;
