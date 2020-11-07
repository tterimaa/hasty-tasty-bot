const axios = require('axios');

const FLASK_API_URL = 'http://127.0.0.1:5000/json';

const callAito = async (object) => {
  const res = await axios.post(FLASK_API_URL, object);
  return res;
};

module.exports = { callAito };
