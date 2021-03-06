import { handlePost, handleGet } from './handler';

const baseUrl = 'http://localhost:3000';
// const env = 'debug'; // Debug only
const post = (url, data) => handlePost(baseUrl, url, data);
const get = (url, data) => handleGet(baseUrl, url, data);

export const getPosts = () => get('/posts/list');
// export const post = (id, data) => {
//   if (data) return post(`/posts/${id}`, data);
//   return get(`/posts/${id}`);
// };
export const newPost = title => post('/posts/new', { title });
export const getPages = () => get('/pages/list');
export const page = (id, data) => {
  if (data) return post(`/pages/${id}`, data);
  return get(`/pages/${id}`);
};
export const deploy = message => post('/deploy', { message });
export const newPage = title => post('/pages/new', { title });
export const uploadImage = (data, filename) => post('/images/upload', { data, filename });
export const remove = id => post(`/posts/${id}/remove`);
export const publish = id => post(`/posts/${id}/publish`);
export const unpublish = id => post(`/posts/${id}/unpublish`);
export const renamePost = (id, filename) => post(`/posts/${id}/rename`, {
  filename,
});
export const tagsCategoriesAndMetadata = () => get('/tags-categories-and-metadata');
export const getSettings = () => get('/settings/list');
export const setSetting = (name, value, addedOptions) => post('/settings/set', {
  name,
  value,
  addedOptions,
});


// export default api;
