<template>
	<div>
		<!-- Coins -->
		<div v-if="view === 1">
			<h2>Monedas Estables - Top 10</h2>

			<div class="coinContainer">
				<coin
					v-for="coin in stableCoins"
					:key="coin.symbol"
					:coin="coin"
					@seeExchangers="getExchangers"
				/>
			</div>

			<br />
			<h2>Monedas No Estables - Top 10</h2>
			<div class="coinContainer">
				<coin
					v-for="coin in unstableCoins"
					:key="coin.symbol"
					:coin="coin"
					@seeExchangers="getExchangers"
				/>
			</div>
		</div>

		<!-- Agencies -->
		<div v-else-if="view === 2">
			<h2>
				Agencias disponibles para
				{{
					selectedCoin.name + " (" + selectedCoin.symbol.toUpperCase() + ") "
				}}
			</h2>

			<div v-if="showAgency === 1">
				<p>Aguarde un momento por favor.</p>
			</div>

			<div v-else-if="showAgency === 2">
				<agencies :exchangers="exchangers" @operation="goToOperations" />
				<button @click="backToCoins">Volver al menu anterior</button>
			</div>

			<div v-else>
				<p>
					Lo sentimos, no tenemos ninguna agencia disponible para esta moneda,
					en este momento.
				</p>
				<button @click="backToCoins">Volver al menu anterior</button>
			</div>
		</div>

		<!-- Operation -->
		<operation
			v-else-if="view === 3"
			:exchangers="exchangers"
			:selectedCoin="selectedCoin"
			:selectedExchanger="selectedExchanger"
			:exchangeType="exchangeType"
			@verify="verifyOperation"
			@back="backToExchanger"
		/>

		<div v-else-if="view === 4">
			<h3>
				¿Está Seguro que desea {{ exchangeType.toUpperCase() }} {{ amount }}
				{{ selectedCoin.symbol.toUpperCase() }}?
			</h3>
			<button @click="executeOperation">Si</button>
			<button @click="view = 3">No</button>
		</div>

		<!-- Error Messages -->
		<div v-else-if="view === 5">
			<h3>Ha ocurrido un error durante la operación. Inténtelo nuevamente.</h3>
			<button @click="backToOperations">Volver al menú inicial</button>
		</div>

		<div v-else-if="view === 6">
			<h3>Usted no posee la moneda que esta intentando vender.</h3>
			<button @click="backToCoins">Volver al menú inicial</button>
		</div>

		<div v-else-if="view === 7">
			<h3>
				Usted no posee la cantidad suficiente de la moneda que está intentando
				vender.
			</h3>
			<button @click="backToCoins">Volver al menú inicial</button>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import coin from "../components/Coin.vue";
import agencies from "../components/Agencies.vue";
import operation from "../components/Operation.vue";
import criptoYaAPI from "../services/criptoYaApi.js";
import laboAPI from "../services/laboAPI.js";

export default {
	name: "Coins",
	components: {
		coin,
		agencies,
		operation,
	},
	data() {
		return {
			view: 1,
			selectedCoin: null,
			selectedExchanger: null,
			exchangeType: null,
			exchangers: [],
			showAgency: 1,
			currency: "ars",
			amount: 0,
		};
	},
	computed: mapState({
		stableCoins: (state) => state.currentStableCoins,
		unstableCoins: (state) => state.currentUnstableCoins,
		user: (state) => state.user,
	}),
	methods: {
		...mapActions(["getUserMovements"]),
		...mapMutations(["setShowMainView"]),
		getExchangers(coin) {
			this.selectedCoin = coin;
			this.view = 2;
			criptoYaAPI
				.getCurrentExchangers(this.selectedCoin.symbol, this.currency)
				.then((incomingData) => {
					this.exchangers = incomingData.data;
					this.showAgency = 2;
				})
				.catch(() => {
					console.log("Ocurrió un error durante la conexión con el servidor.");
					this.showAgency = 3;
				});
		},
		backToCoins() {
			this.selectedCoin = null;
			this.exchangers = [];
			this.view = 1;
			this.showAgency = 1;
			this.currency = "ars";
		},
		goToOperations(exchanger, type) {
			if (type === "vender") {
				let existsCoin = this.$store.state.userCoins.find(
					(s) => s.crypto_code === this.selectedCoin.symbol
				);
				// console.log(existsCoin);
				if (existsCoin != null) {
					if (
						existsCoin.purchase.crypto_amount - existsCoin.sell.crypto_amount >
						0
					) {
						this.selectedExchanger = exchanger;
						this.exchangeType = type;
						this.view = 3;
					} else {
						this.view = 6;
					}
				} else {
					this.view = 6;
				}
			} else {
				this.selectedExchanger = exchanger;
				this.exchangeType = type;
				this.view = 3;
			}
		},
		backToOperations() {
			this.view = 3;
		},
		backToExchanger() {
			this.selectedExchanger = null;
			this.exchangeType = null;
			this.view = 2;
			this.amount = null;
		},
		verifyOperation(amount) {
			this.amount = amount;
			if (this.exchangeType === "vender") {
				let existsCoin = this.$store.state.userCoins.find(
					(s) => s.crypto_code === this.selectedCoin.symbol
				);
				if (
					!(
						existsCoin.purchase.crypto_amount - existsCoin.sell.crypto_amount >=
						this.amount
					)
				) {
					this.view = 7;
				} else {
					this.view = 4;
				}
			} else {
				this.view = 4;
			}
		},
		executeOperation() {
			let dateRaw = new Date();
			let dateString = new Date(
				parseInt(dateRaw.getFullYear()),
				parseInt(dateRaw.getMonth()),
				parseInt(dateRaw.getDate()),
				parseInt(dateRaw.getHours() - 3),
				parseInt(dateRaw.getMinutes())
			);
			// console.log(dateString);
			this.setShowMainView(2);
			laboAPI
				.postOperation(
					this.user,
					this.exchangeType === "comprar" ? "purchase" : "sale",
					this.selectedCoin.symbol,
					this.amount,
					this.exchangeType === "comprar"
						? this.amount * this.exchangers[this.selectedExchanger].totalAsk
						: this.amount * this.exchangers[this.selectedExchanger].totalBid,
					dateString
				)
				.then(() => {
					this.getUserMovements();
					this.$router.push({ name: "CurrentStatus" });
				})
				.catch(() => {
					this.setShowMainView(3);
					this.view = 5;
					console.log("Ocurrió un error durante la conexión con el servidor.");
				});
		},
	},
};
</script>

<style scoped>
.coinContainer {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.currencyContainer {
	margin: 10px;
}

.currencyContainer > label {
	margin: 10px;
}

img {
	margin-top: 10px;
}

label {
	margin-right: 10px;
}
</style>
