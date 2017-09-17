
const React = require('react');

const SinceWhen = React.createClass({
  componentDidMount() {
    this._iv = setInterval(this.tick, 5000);
  },
  componentWillUnmount() {
    clearInterval(this._iv);
  },
  getDefaultProps() {
    return {
      prefix: '',
    };
  },
  getInitialState() {
    return {
      time: this.props.time.fromNow(),
    };
  },
  tick() {
    if (!this.isMounted()) {
      return clearInterval(this._iv);
    }
    this.setState({ time: this.props.time.fromNow() });
  },
  render() {
    return this.transferPropsTo(<span>{this.props.prefix + this.state.time}</span>);
  },
});

module.exports = SinceWhen;
