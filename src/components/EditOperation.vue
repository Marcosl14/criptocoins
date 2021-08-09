<template>
	<div class="form-container">
		<form
			@reset="goBack"
			@submit.prevent="changeOperation"
			class="edition-form"
		>
			<div>
				<div>
					<label>Criptomoneda</label>
					<br />
					<select v-model="selectedItem.crypto_code">
						<option
							v-for="coin in $store.state.userCoins"
							:key="coin._id"
							:value="coin.crypto_code"
						>
							{{ coin.crypto_code.toUpperCase() }}
						</option>
					</select>
					<!-- <label>{{ coin.crypto_code.toUpperCase() }}</label> -->
				</div>
				<div>
					<label>Tipo de Operación</label>
					<br />
					<select v-model="selectedItem.action">
						<option value="purchase">Comprar</option>
						<option value="sale">Vender</option>
					</select>
					<!-- <label>{{ selectedItem.action === "purchase" ? "Compra" : "Venta" }}</label> -->
				</div>
			</div>
			<!-- <div>
				<div>
					<label>Editar por cantidad o por monto en ARS?</label>
					<br />
					<label>Cantidad</label>
					<input type="radio" v-model="selection" value="1" />
					<label>Monto</label>
					<input type="radio" v-model="selection" value="2" />
				</div>
			</div> -->
			<div>
				<div>
					<label>Cantidad</label>
					<br />
					<input
						type="number"
						step="0.00001"
						v-model.number="selectedItem.crypto_amount"
						@input="adjustMoney"
					/>
					<br />
					<transition
						><p class="errorMsg" v-if="selectedItem.crypto_amount <= 0">
							La cantidad debe ser superior a 0.
						</p>
					</transition>
				</div>
				<div>
					<label>Monto en pesos</label>
					<br />
					<input
						type="number"
						step="0.01"
						v-model.number="selectedItem.money"
						@input="adjustCryptoAmount"
					/>
					<br />
					<transition
						><p class="errorMsg" v-if="selectedItem.money <= 0">
							El monto debe ser superior a 0.
						</p>
					</transition>
				</div>
			</div>
			<div>
				<div>
					<label>Precio de la Operación</label>
					<br />
					<input
						type="number"
						step="0.01"
						v-model.number="operationPrice"
						@input="adjustMoney"
					/>
					<br />
					<transition
						><p class="errorMsg" v-if="operationPrice <= 0">
							El precio debe ser superior a 0.
						</p>
					</transition>
				</div>
			</div>
			<div>
				<div>
					<label>Fecha de la operación</label>
					<br />
					<input type="datetime-local" v-model="selectedItem.datetime" />
					<br />
					<transition
						><p class="errorMsg" v-if="!verifyDate">
							La fecha de la operación no puede ser superior a la fecha actual.
						</p>
					</transition>
				</div>
			</div>
			<div>
				<input
					type="submit"
					value="Aceptar"
					:disabled="
						selectedItem.crypto_amount <= 0 ||
						selectedItem.money <= 0 ||
						operationPrice <= 0 ||
						!verifyDate
					"
				/>
				<input type="reset" value="Cancelar" />
			</div>
		</form>
	</div>
</template>

<script>
export default {
	name: "EditOperation",
	data() {
		return {
			selectedItem: this.item,
			operationPrice: this.price,
			selection: 1,
		};
	},
	props: {
		item: {
			required: true,
		},
		price: {
			required: true,
		},
	},
	computed: {
		verifyDate() {
			let operationDate = new Date(
				this.selectedItem.datetime.substring(0, 4),
				parseInt(this.selectedItem.datetime.substring(5, 7)) - 1,
				this.selectedItem.datetime.substring(8, 10),
				this.selectedItem.datetime.substring(11, 13),
				this.selectedItem.datetime.substring(14, 16)
			);
			let todayDate = new Date();
			return todayDate > operationDate;
		},
	},
	methods: {
		goBack() {
			this.$emit("go-back");
		},
		changeOperation() {
			this.$emit("change-operation", this.selectedItem);
		},
		adjustCryptoAmount() {
			// console.log(this.operationPrice);
			this.selectedItem.crypto_amount = (
				this.selectedItem.money / this.operationPrice
			).toFixed(5);
		},
		adjustMoney() {
			// console.log(this.operationPrice);
			this.selectedItem.money = (
				this.selectedItem.crypto_amount * this.operationPrice
			).toFixed(2);
		},
	},
};
</script>

<style scoped>
.edition-form {
	border-style: solid;
	border-radius: 10px;
	width: 40vw;
	min-width: 400px;
	font-size: 14px;
}

.edition-form input {
	border-style: solid;
	border-radius: 10px;
	padding: 5px;
	width: 80px;
	text-align: center;
	margin-top: 5px;
	transition: all 0.35s ease-in-out;
}

.edition-form select {
	border-style: solid;
	border-width: 2px;
	border-radius: 10px;
	padding: 5px;
	width: 134px;
	margin-top: 5px;
	transition: all 0.35s ease-in-out;
}

.edition-form input[type="datetime-local"] {
	border-style: solid;
	border-width: 2px;
	border-radius: 10px;
	padding: 5px;
	width: 200px;
	margin-top: 5px;
	transition: all 0.35s ease-in-out;
}

.edition-form input:focus,
select:focus,
input[type="datetime-local"]:focus {
	border-color: #4fc3a1;
	outline: 0;
	color: white;
	background-color: #324960;
	transition: all 0.35s ease-in-out;
}

.edition-form > div {
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	margin-top: 20px;
}

.edition-form > div > div {
	width: 50%;
}

.edition-form input[type="submit"],
input[type="reset"] {
	padding: 5px 15px;
	background: #fff;
	border-radius: 4px;
	font-weight: 600;
	color: #111;
	background: #9bdc28;
	width: 120px;
	margin-top: 20px;
	margin-bottom: 25px;
}

.edition-form input[type="submit"]:hover,
input[type="reset"]:hover {
	color: #ffffff;
	background: #324960;
}

.edition-form input[type="submit"]:disabled {
	color: #111;
	background: #9bdc28;
	opacity: 0.5;
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

.errorMsg {
	display: inline-block;
	font-size: 10px;
	color: red;
	font-weight: bold;
	margin-top: 5px;
	text-align: center;
}

.v-enter-from {
	transform: translateY(50px);
	opacity: 0;
}

.v-enter-active {
	transition: all 0.3s ease-out;
}

.v-enter-to {
	opacity: 1;
}
</style>
