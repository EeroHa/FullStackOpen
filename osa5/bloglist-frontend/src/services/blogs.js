import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (blog) => {
  console.log(`Creating blog: ${blog}`);

  const config = {
    headers: { Authorization: token },
  };
  console.log(config);
  const response = await axios.post(baseUrl, blog, config);
  return response.data;
};

const update = async (blog, id) => {
  const response = await axios.put(`${baseUrl}/${id}`, blog);
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, setToken, update };
