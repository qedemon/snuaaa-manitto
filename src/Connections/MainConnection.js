import axios from "axios";

// const instance = axios.create({
//   baseURL: "https://devapi.snuaaa.net/api/",
// });

// const request = {
//   post: async (url, body) => instance.post(url, body),
// };

const instance = axios.create({
  baseURL: "https://api.nova.snuaaa.net:9887/manitto/authenticate/",
});

const request = {
  post: async (url, body) => instance.post(url, body),
};

export default request;
