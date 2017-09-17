
const React = require('react');
const writeGood = require('write-good');

const PT = React.PropTypes;

// component for individual grammar suggestion
const GrammarSuggestion = React.createClass({
  propTypes: {
    suggestion: PT.string,
  },

  render() {
    const suggestion = this.props.suggestion.split('\n');
    let reason = suggestion.pop();
    const endStrong = reason.indexOf('" ') + 1;
    reason = (<p className="grammar_reason">
      <strong>{reason.substr(0, endStrong)}</strong>{reason.slice(endStrong)}
    </p>);

    return (<div className="grammar_box">
      {suggestion && <pre className="grammar_suggestion">
        {suggestion.join('\n')}
      </pre>}
      {reason}
    </div>);
  },
});

// builds array of GrammarSuggestion components from writeGood suggestions
const suggestionContents = function (suggestions) {
  let contents = [];
  if (suggestions.length === 0) {
    const golden = { color: 'gold' };
    contents = (<div className="grammar_box">
      <p className="grammar_reason"><i style={golden} className="fa fa-star" />&nbsp;Nice! No possible improvements were found!</p>
    </div>);
  } else {
    suggestions.forEach((suggestion, i) => {
      contents.push(GrammarSuggestion({ suggestion, key: `suggestion-${i}` }));
    });
  }
  return contents;
};

// takes the place of Rendered in the editor, showing grammar suggestions
const CheckGrammar = React.createClass({
  propTypes: {
    toggleGrammar: PT.func,
    raw: PT.string,
  },

  getInitialState() {
    return {
      suggestions: [],
    };
  },

  componentDidUpdate(prevProps) {
    if (prevProps.raw !== this.props.raw) {
      const suggestions = writeGood.annotate(this.props.raw, writeGood(this.props.raw));
      this.setState({ suggestions: suggestionContents(suggestions) });
    }
  },

  componentDidMount() {
    const suggestions = writeGood.annotate(this.props.raw, writeGood(this.props.raw));
    this.setState({ suggestions: suggestionContents(suggestions) });
  },

  render() {
    const creditStyle = {
      'margin-top': '-24px',
    };
    return (<div className="post-content editor_rendered">
      <h2>Writing Suggestions</h2>
      <p style={creditStyle}>Brought to you by <a href="https://github.com/btford/write-good" target="_blank">write-good</a>.</p>
      {this.state.suggestions}
      <button
        onClick={this.props.toggleGrammar}
        className="pb-button grammar_backToPreview"
      >
      Back to Preview
      </button>
    </div>);
  },
});

module.exports = CheckGrammar;
