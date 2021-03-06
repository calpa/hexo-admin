import React, { Component } from 'react';

import { deploy } from '../api';

const divStyle = {
  whiteSpace: 'nowrap',
};

// const Deploy = React.createClass({
class Deploy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stdout: '',
      stderr: '',
      error: null,
      message: '',
      status: 'initial',
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const message = this.state.message;
    this.setState({
      message: '',
      error: null,
      stdout: '',
      stderr: '',
      status: 'loading',
    });
    deploy(message).then((result) => {
      this.setState({
        status: result.error ? 'error' : 'success',
        error: result.error,
        stdout: result.stdout && result.stdout.trim(),
        stderr: result.stderr && result.stderr.trim(),
      });
    });
  }

  render() {
    let body;
    if (this.state.error) {
      body = <h4>Error: {this.state.error}</h4>;
    } else if (this.state.status === 'loading') {
      body = <h4>Loading...</h4>;
    } else if (this.state.status === 'success') {
      body = (
        <div>
          <h4>Std Output</h4>
          <pre>
            {this.state.stdout}
          </pre>
          <h4>Std Error</h4>
          <pre>
            {this.state.stderr}
          </pre>
        </div>
      );
    }

    return (
      <div className="deploy" style={divStyle}>
        <p>
          Type a message here and hit `deploy` to run your deploy script.
        </p>
        <form className="deploy_form" onSubmit={() => this.handleSubmit}>
          <input
            type="text"
            className="deploy_message"
            value={this.state.message}
            placeholder="Deploy/commit message"
            onChange={e => this.setState({ message: e.target.value })}
          />
          <input type="submit" value="Deploy" />
        </form>
        {body}
      </div>
    );
  }
}

module.exports = Deploy;
