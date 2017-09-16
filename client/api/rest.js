import { handlePost, handleGet } from './handler';

const rest = (baseUrl) => {
  const post = () => handlePost(baseUrl);
  const get = () => handleGet(baseUrl);

  return {
    posts: () => get('/posts/list'),
    post: (id, data) => {
      if (data) return post(`/posts/${id}`, data);
      return get(`/posts/${id}`);
    },
    newPost: title => post('/posts/new', { title }),
    pages: () => get('/pages/list'),
    page: (id, data) => {
      if (data) return post(`/pages/${id}`, data);
      return get(`/pages/${id}`);
    },
    deploy: message => post('/deploy', { message }),
    newPage: title => post('/pages/new', { title }),
    uploadImage: (data, filename) => post('/images/upload', { data, filename }),
    remove: id => post(`/posts/${id}/remove`),
    publish: id => post(`/posts/${id}/publish`),
    unpublish: id => post(`/posts/${id}/unpublish`),
    renamePost: (id, filename) => post(`/posts/${id}/rename`, {
      filename,
    }),
    tagsCategoriesAndMetadata: () => get('/tags-categories-and-metadata'),
    settings: () => get('/settings/list'),
    setSetting: (name, value, addedOptions) => post('/settings/set', {
      name,
      value,
      addedOptions,
    }),
  };
};

export default rest;
