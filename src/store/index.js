import { createStore } from "vuex";
import coinGecko from "../services/coinGecko";
import laboAPI from "../services/laboAPI.js";
import criptoYaApi from "../services/criptoYaApi.js";

export default createStore({
	state: {
		availableCoin: [],
		currentStableCoins: [],
		currentUnstableCoins: [],
		user: "",
		userMovements: [],
		userCoins: [],
		currentPrices: [],
		showMainView: 1,
		operationView: 1,
	},
	getters: {
		getUserInformation: (state) => {
			let purchaseAmount = 0;
			let sellAmount = 0;
			for (let movement of state.userMovements) {
				if (movement.action === "purchase") {
					purchaseAmount += parseFloat(movement.money);
				} else {
					sellAmount += parseFloat(movement.money);
				}
			}

			let totalAmount = 0;
			let totalWinings = 0;

			for (let coin of state.userCoins) {
				let index = state.currentPrices.findIndex(
					(s) => s.coin === coin.crypto_code
				);
				if (index >= 0) {
					totalAmount +=
						(coin.purchase.crypto_amount - coin.sell.crypto_amount) *
						state.currentPrices[index].data.totalBid;
					totalWinings +=
						(coin.purchase.crypto_amount - coin.sell.crypto_amount) *
						(state.currentPrices[index].data.totalBid -
							coin.purchase.money / coin.purchase.crypto_amount);
				}
			}

			return {
				purchaseAmount: purchaseAmount.toFixed(2),
				sellAmount: sellAmount.toFixed(2),
				totalAmount: totalAmount.toFixed(2),
				totalWinings: totalWinings.toFixed(2),
			};
		},
		getCurrentUserCoins: (state) => {
			let coins = [];
			let amounts = [];
			for (let coin of state.userCoins) {
				let index = state.currentPrices.findIndex(
					(s) => s.coin === coin.crypto_code
				);
				if (index >= 0) {
					coins.push(coin.crypto_code.toUpperCase());
					amounts.push(
						(coin.purchase.crypto_amount - coin.sell.crypto_amount) *
							state.currentPrices[index].data.totalBid
					);
				}
			}
			return { coins: coins, amounts: amounts };
		},
	},
	mutations: {
		setCoins(state, coins) {
			for (let coin of coins) {
				if (coin.market_data.market_cap_rank < 30) {
					if (coin.market_data.price_change_percentage_1y < 10) {
						if (state.currentStableCoins.length < 10) {
							state.currentStableCoins.push(coin);
						}
					} else {
						if (state.currentUnstableCoins.length < 10) {
							state.currentUnstableCoins.push(coin);
						}
					}
				}
			}
		},
		setUser(state, newUser) {
			state.user = newUser;
		},
		setUserMovements(state, movements) {
			state.userMovements = movements;
		},
		setUserCoins(state, value) {
			if (value === null) {
				for (let movement of state.userMovements) {
					if (
						!state.userCoins.find((s) => s.crypto_code === movement.crypto_code)
					) {
						if (movement.action === "purchase") {
							state.userCoins.push({
								crypto_code: movement.crypto_code,
								purchase: {
									crypto_amount: parseFloat(movement.crypto_amount),
									money: parseFloat(movement.money),
								},
								sell: {
									crypto_amount: 0,
									money: 0,
								},
							});
						} else {
							state.userCoins.push({
								crypto_code: movement.crypto_code,
								purchase: { crypto_amount: 0, money: 0 },
								sell: {
									crypto_amount: parseFloat(movement.crypto_amount),
									money: parseFloat(movement.money),
								},
							});
						}
					} else {
						let index = state.userCoins.findIndex(
							(s) => s.crypto_code === movement.crypto_code
						);
						if (movement.action === "purchase") {
							state.userCoins[index].purchase.money += parseFloat(
								movement.money
							);
							state.userCoins[index].purchase.crypto_amount += parseFloat(
								movement.crypto_amount
							);
						} else {
							state.userCoins[index].sell.money += parseFloat(movement.money);
							state.userCoins[index].sell.crypto_amount += parseFloat(
								movement.crypto_amount
							);
						}
					}
				}
			} else {
				state.userCoins = value;
			}
		},
		setCurrentPrices(state, coin) {
			state.currentPrices.push(coin);
		},
		setShowMainView(state, view) {
			state.showMainView = view;
		},
		setOperationView(state, view) {
			state.operationView = view;
		},
	},
	actions: {
		getCoins(context) {
			coinGecko
				.getCoins()
				.then((incomingData) => {
					context.state.availableCoin = incomingData.data;
					context.commit("setCoins", incomingData.data);
					console.log(incomingData.data);
				})
				.catch(() => {
					console.log("Ocurrió un error durante la conexión con el servidor.");
				});
		},
		getUserMovements(context) {
			context.commit("setUserCoins", []);
			context.commit("setUserMovements", []);
			laboAPI
				.getUserMovements(context.state.user)
				.then((incomingData) => {
					context.commit(
						"setUserMovements",
						incomingData.data.sort((a, b) =>
							a.datetime.localeCompare(b.datetime)
						)
					);
					context.commit("setShowMainView", 3);
					context.commit("setOperationView", 1);
					context.commit("setUserCoins", null);
					// console.log(incomingData);
					// console.log(context.state.userCoins);
				})
				.catch(() => {
					console.log("Ocurrió un error durante la conexión con el servidor.");
				});
		},
		getCurrentPrices(context) {
			criptoYaApi
				.getPrice("bitex", "btc")
				.then((incomingData) => {
					// console.log(incomingData.data);
					context.commit("setCurrentPrices", {
						coin: "btc",
						data: incomingData.data,
					});
				})
				.catch(() => {
					context.commit("setCurrentPrices", {
						coin: "btc",
						data: "sin datos",
					});
					console.log("Ocurrió un error durante la conexión con el servidor.");
				});
			criptoYaApi
				.getPrice("universalcoins", "eth")
				.then((incomingData) => {
					// console.log(incomingData.data);
					context.commit("setCurrentPrices", {
						coin: "eth",
						data: incomingData.data,
					});
				})
				.catch(() => {
					context.commit("setCurrentPrices", {
						coin: "eth",
						data: "sin datos",
					});
					console.log("Ocurrió un error durante la conexión con el servidor.");
				});
			criptoYaApi
				.getPrice("universalcoins", "usdt")
				.then((incomingData) => {
					// console.log(incomingData.data);
					context.commit("setCurrentPrices", {
						coin: "usdt",
						data: incomingData.data,
					});
				})
				.catch(() => {
					context.commit("setCurrentPrices", {
						coin: "usdt",
						data: "sin datos",
					});
					console.log("Ocurrió un error durante la conexión con el servidor.");
				});
			criptoYaApi
				.getPrice("satoshitango", "usdc")
				.then((incomingData) => {
					// console.log(incomingData.data);
					context.commit("setCurrentPrices", {
						coin: "usdc",
						data: incomingData.data,
					});
				})
				.catch(() => {
					context.commit("setCurrentPrices", {
						coin: "usdc",
						data: "sin datos",
					});
					console.log("Ocurrió un error durante la conexión con el servidor.");
				});
			criptoYaApi
				.getPrice("tiendadolar", "dai")
				.then((incomingData) => {
					// console.log(incomingData.data);
					context.commit("setCurrentPrices", {
						coin: "dai",
						data: incomingData.data,
					});
				})
				.catch(() => {
					context.commit("setCurrentPrices", {
						coin: "dai",
						data: "sin datos",
					});
					console.log("Ocurrió un error durante la conexión con el servidor.");
				});
		},
	},
	modules: {},
});
