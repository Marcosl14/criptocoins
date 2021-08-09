import axios from "axios";

const APIclient = axios.create({
  baseURL: "https://pro-api.coinmarketcap.com/",
  headers: {
    "X-CMC_PRO_API_KEY": "62ea1d51-e7a9-4460-866b-08386800a180",
  },
});

export default {
  getCurrentStableCriptos() {
    return APIclient.get("v1/cryptocurrency/listings/latest");
  },
};
