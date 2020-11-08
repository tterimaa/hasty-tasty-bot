const axios = require('axios');

const FLASK_API_URL = 'https://stormy-reef-57826.herokuapp.com/json';

const callAito = async (object) => {
  const res = await axios.post(FLASK_API_URL, object);
  return res;
};

module.exports = { callAito };
