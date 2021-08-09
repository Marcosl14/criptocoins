<template>
	<div>
		<img :src="selectedCoin.image.large" :alt="selectedCoin.name" />
		<h3>
			{{ operationSummary }}
		</h3>
		<h3>
			{{ unitValue }}
		</h3>
		<label
			>Seleccione el monto de {{ selectedCoin.symbol.toUpperCase() }} que desea
			{{ exchangeType }}</label
		>
		<input
			type="number"
			:placeholder="selectedCoin.symbol.toUpperCase()"
			v-model.number="criptoAmount"
			@input="adjustMoneyAmount"
		/>
		<br />
		<label>O bien, seleccione el monto en pesos</label>
		<input
			type="number"
			:placeholder="selectedCoin.symbol.toUpperCase()"
			v-model.number="moneyAmount"
			@input="adjustCriptoAmount"
		/>
		<br />
		<br />
		<button @click="verifyOperation" :disabled="!(criptoAmount > 0)">
			{{ exchangeType[0].toUpperCase() + exchangeType.substring(1) }}
		</button>
		<button @click="backToExchanger">Volver al menu anterior</button>
	</div>
</template>

<script>
export default {
	name: "Operation",
	data() {
		return { moneyAmount: 0, criptoAmount: 0 };
	},
	props: {
		selectedCoin: {
			required: true,
		},
		selectedExchanger: {
			required: true,
		},
		exchangers: {
			required: true,
		},
		exchangeType: {
			required: true,
		},
	},
	computed: {
		operationSummary() {
			return `Usted está a punto de ${this.exchangeType.toUpperCase()} la criptomoneda
			${this.selectedCoin.name.toUpperCase()} (${this.selectedCoin.symbol.toUpperCase()}) en la agencia
			${this.selectedExchanger.toUpperCase()}`;
		},
		unitValue() {
			if (this.exchangeType === "comprar") {
				return `El valor unitario es de	${Intl.NumberFormat("es-Es", {
					style: "currency",
					currency: "ARS",
				}).format(
					this.exchangers[this.selectedExchanger].totalAsk
				)} por ${this.selectedCoin.symbol.toUpperCase()}`;
			} else {
				return `El valor unitario es de	${Intl.NumberFormat("es-Es", {
					style: "currency",
					currency: "ARS",
				}).format(
					this.exchangers[this.selectedExchanger].totalBid
				)} por ${this.selectedCoin.symbol.toUpperCase()}`;
			}
		},
	},
	methods: {
		verifyOperation() {
			this.$emit("verify", this.criptoAmount);
		},
		backToExchanger() {
			this.$emit("back");
		},
		adjustMoneyAmount() {
			if (this.exchangeType === "comprar") {
				this.moneyAmount = (
					this.exchangers[this.selectedExchanger].totalAsk * this.criptoAmount
				).toFixed(2);
			} else {
				this.moneyAmount = (
					this.exchangers[this.selectedExchanger].totalBid * this.criptoAmount
				).toFixed(2);
			}
		},
		adjustCriptoAmount() {
			if (this.exchangeType === "comprar") {
				this.criptoAmount = (
					this.moneyAmount / this.exchangers[this.selectedExchanger].totalAsk
				).toFixed(5);
			} else {
				this.criptoAmount = (
					this.moneyAmount / this.exchangers[this.selectedExchanger].totalBid
				).toFixed(5);
			}
		},
	},
};
</script>

<style scoped>
label {
	margin-right: 20px;
}
input {
	border-style: solid;
	border-radius: 10px;
	padding: 5px;
	width: 80px;
	text-align: center;
	margin-top: 5px;
	transition: all 0.35s ease-in-out;
}

input:focus {
	border-color: #4fc3a1;
	outline: 0;
	color: white;
	background-color: #324960;
	transition: all 0.35s ease-in-out;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/* Firefox */
input[type="number"] {
	-moz-appearance: textfield;
}
</style>
