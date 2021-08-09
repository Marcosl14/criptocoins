<template>
	<div class="see-coin">
		<div>
			<img :src="imageSource" :alt="imageAlt" />
		</div>
		<div>
			<label>Criptomoneda: {{ selectedItem.crypto_code.toUpperCase() }}</label>
			<label
				>Tipo de Operación:
				{{ selectedItem.action === "purchase" ? "Compra" : "Venta" }}</label
			>
			<label>Cantidad: {{ selectedItem.crypto_amount }}</label>
			<label>Monto en pesos: {{ selectedItem.money }}</label>
			<label>
				Fecha de la operación: {{ selectedItem.datetime.slice(0, 10) }} /
				{{ selectedItem.datetime.slice(11, 18) }}
			</label>
		</div>
	</div>
</template>

<script>
export default {
	name: "SeeOperation",
	data() {
		return {};
	},
	props: {
		selectedItem: {
			required: true,
		},
	},
	computed: {
		imageSource() {
			return this.$store.state.availableCoin.find(
				(coin) => coin.symbol === this.selectedItem.crypto_code
			).image.large;
		},
		imageAlt() {
			return this.$store.state.availableCoin.find(
				(coin) => coin.symbol === this.selectedItem.crypto_code
			).id;
		},
	},
	methods: {},
};
</script>

<style scoped>
.see-coin {
	display: flex;
	flex-direction: row;
	justify-content: center;
}
.see-coin div:last-of-type {
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
}
</style>
