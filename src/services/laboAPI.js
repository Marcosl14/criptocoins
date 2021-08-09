import axios from "axios";

const APIclient = axios.create({
  baseURL: "https://laboratorio3-f36a.restdb.io/rest",
  headers: { "x-apikey": "60eb09146661365596af552f" },
});

export default {
  getUserMovements(user) {
    return APIclient.get(`/transactions?q={"user_id": "${user}"}`);
  },
  postOperation(user, type, cripto, amount, money, dateTime) {
    return APIclient.post("/transactions", {
      user_id: user,
      action: type,
      crypto_code: cripto,
      crypto_amount: amount,
      money: money.toFixed(2),
      datetime: dateTime,
    });
  },
  deleteOperation(id) {
    return APIclient.delete("/transactions/" + id);
  },
  getOperation(id) {
    return APIclient.get("/transactions/" + id);
  },
  editOperation(movement) {
    return APIclient.patch("/transactions/" + movement._id, movement);
  },
};
