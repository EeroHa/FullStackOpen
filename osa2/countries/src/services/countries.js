import axios from 'axios';
const baseUrl = 'https://restcountries.com';
const v = '/v3.1';

const getAll = () => {
  return axios.get(`${baseUrl}${v}/all`);
};

const countryService = { getAll };

export default countryService;
