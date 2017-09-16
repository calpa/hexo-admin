
const spawn = require('child_process').spawn;

function once(fn) {
  let called = false;
  return () => {
    if (!called) {
      fn.apply(this, arguments);
    }
    called = true;
  };
}

module.exports = (command, message, done) => {
  done = once(done);
  const proc = spawn(command, [message], { detached: true });
  let stdout = '';
  let stderr = '';
  proc.stdout.on('data', (data) => { stdout += data.toString(); });
  proc.stderr.on('data', (data) => { stderr += data.toString(); });
  proc.on('error', (err) => {
    done(err, { stdout, stderr });
  });
  proc.on('close', () => {
    done(null, { stdout, stderr });
  });
};
