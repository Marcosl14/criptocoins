import axios from "axios";

const APIclient = axios.create({
  baseURL: "https://api.coingecko.com/api/v3/",
  withCredentials: false,
});

export default {
  getCoins() {
    return APIclient.get("coins");
  },
};
