import axios from 'axios';
let API_URL = `${window.location.origin}`;

const reportIssue = (issue) => {
  console.log('reporting' + issue);
  return axios.post(`${API_URL}/issue`, {
    issue,
  });
};

export { reportIssue };
