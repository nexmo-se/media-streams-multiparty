import axios from 'axios';
let API_URL = `${window.location.origin}`;

export const getCredentials = async (roomName) => {
  return axios.get(`${API_URL}/session/${roomName}`);
};
