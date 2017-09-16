import rest from './rest';

const types = {
  rest,
};

const mod = {
  init: (type, config) => {
    if (typeof type === 'string') {
      type = types[type];
    }
    const api = type(config);
    for (const name in api) {
      mod[name] = api[name];
    }
  },
};

module.exports = mod;
