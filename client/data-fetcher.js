const dataFetcher = (params) => {
  const items = fetch(params);
  Object.keys(items).forEach((name) => {
    Promise.resolve(items[name]).then((data) => {
      const update = {};
      update[name] = data;
      this.setState(update);
      if (this.dataDidLoad) {
        this.dataDidLoad(name, data);
      }
    });
  });
};

export default dataFetcher;
