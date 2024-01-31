import axios from "axios";
import { getToken } from "../Utils/Cookie";

const instance = axios.create({
  baseURL: "https://api.nova.snuaaa.net:9887/manitto",
});

const request = {
  get: async (url) =>
    instance.get(url, {
      headers: { Authorization: `Bearer ${getToken()}` },
    }),

  post: async (url, body) =>
    instance.post(url, body, {
      headers: { Authorization: `Bearer ${getToken()}` },
    }),
};

export default request;
