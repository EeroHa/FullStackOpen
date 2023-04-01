import axios from 'axios';
const baseUrl = '/api/users';

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const getById = (id) => {
  const resp = axios.get(`${baseUrl}/${id}`);
  return resp.then((r) => r.data);
};

export default { getAll, getById };
