import React from 'react';
import ReactMarkdown from 'react-markdown';

import PropTypes from 'prop-types';

const Rendered = ({ text }) => (
  <div
    className="post-content"
  >
    <ReactMarkdown
      source={text}
    />
  </div>
);

Rendered.propTypes = {
  text: PropTypes.string,
};

Rendered.defaultProps = {
  text: 'Nothing Yet...',
};

module.exports = Rendered;
