import axios from "axios";

const APIclient = axios.create({
  baseURL: "https://criptoya.com/api/",
  withCredentials: false,
});

export default {
  getCurrentExchangers(coin, currency) {
    return APIclient.get(`${coin}/${currency}`);
  },
  getPrice(exchanger, coin) {
    return APIclient.get(`${exchanger}/${coin}`);
  },
};
