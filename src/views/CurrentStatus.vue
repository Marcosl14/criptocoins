<template>
	<div>
		<div v-if="view === 1">
			<div v-if="$store.state.userMovements.length != 0">
				<!-- Current State Resume -->
				<div class="title-container">
					<h2>Resumen del Estado Actual</h2>
					<button
						v-if="!showActualState"
						@click="showActualState = !showActualState"
					>
						+
					</button>
					<button v-else @click="showActualState = !showActualState">-</button>
				</div>
				<transition>
					<StatusResume v-if="showActualState" />
				</transition>

				<!-- Operations Timeline -->
				<div class="title-container">
					<h2>
						Historial de Movimientos (Total
						{{ $store.state.userMovements.length }})
					</h2>
					<button v-if="!showHistory" @click="showHistory = !showHistory">
						+
					</button>
					<button v-else @click="showHistory = !showHistory">-</button>
				</div>
				<transition>
					<OperationsTimeline
						v-if="showHistory"
						@operation="seeOperation"
						@remove="setItem"
					/>
				</transition>

				<!-- Wallet Chart -->
				<div class="title-container">
					<h2>Grafico de Composicion de Cartera en ARS</h2>
					<button v-if="!showChart" @click="showChart = !showChart">+</button>
					<button v-else @click="showChart = !showChart">-</button>
				</div>
				<transition>
					<div v-if="showChart" class="chartContainer">
						<MonthlyChart class="chart" />
					</div>
				</transition>
			</div>
			<div v-else>
				<h3>El usuario ingresado, no presenta movimientos.</h3>
			</div>
		</div>

		<!-- See Operation -->
		<div v-else-if="view === 5">
			<h2>Ver Operación</h2>
			<SeeOperation :selectedItem="selectedItem" />
			<br />
			<button @click="view = 1">Volver al menú anterior</button>
		</div>

		<!-- Edit Operation -->
		<div v-else-if="view === 4">
			<h2>Editar Operación</h2>
			<EditOperation
				:item="selectedItem"
				:price="operationPrice"
				@goBack="view = 1"
				@changeOperation="changeOperation"
			/>
		</div>

		<div v-else-if="view === 6">
			<p>
				Para poder vender esta moneda, es necesario contar con stock suficiente
				primero.
			</p>
			<button @click="view = 1">Volver al menú anterior</button>
		</div>

		<!-- Remove Operation -->
		<div v-else-if="view === 2">
			<h2>Eliminar Operación</h2>
			<SeeOperation :selectedItem="selectedItem" />
			<p>Está seguro que desea eliminar esta operación?.</p>
			<button @click="removeOperation(selectedItem)">Si</button>
			<button @click="view = 1">No</button>
			<br />
		</div>
		<div v-else-if="view === 3">
			<p>
				Lo sentimos, ha ocurrido un error. La operación no ha sido realizada.
			</p>
			<button @click="view = 1">Volver al menú anterior</button>
		</div>
	</div>
</template>

<script>
import laboAPI from "../services/laboAPI.js";
import StatusResume from "../components/StatusResume.vue";
import OperationsTimeline from "../components/OperationsTimeline.vue";
import MonthlyChart from "../components/MonthlyChart.vue";
import SeeOperation from "../components/SeeOperation.vue";
import EditOperation from "../components/EditOperation.vue";

export default {
	name: "CurrentStatus",
	components: {
		MonthlyChart,
		StatusResume,
		OperationsTimeline,
		SeeOperation,
		EditOperation,
	},
	data() {
		return {
			showActualState: true,
			showHistory: false,
			showChart: false,
			selectedItem: {
				_id: "",
				action: "",
				crypto_amount: null,
				crypto_code: "",
				money: null,
				datetime: "",
			},
			view: 1,
			cryptoAmountBeforeEdit: 0,
			operationTypeBeforeEdit: "",
			operationPrice: 0,
		};
	},
	computed: {},
	methods: {
		setItem(movement, view) {
			this.selectedItem = movement;
			this.view = view;
		},
		removeOperation(movement) {
			this.$store.commit("setShowMainView", 2);
			laboAPI
				.deleteOperation(movement._id)
				.then(() => {
					this.$store.dispatch("getUserMovements");
					this.view = 1;
				})
				.catch(() => {
					this.view = 3;
					console.log("Ocurrió un error durante la conexión con el servidor.");
				});
		},
		seeOperation(movement, view) {
			this.$store.commit("setShowMainView", 2);
			laboAPI
				.getOperation(movement._id)
				.then((incomingData) => {
					this.selectedItem._id = incomingData.data._id;
					this.selectedItem.action = incomingData.data.action;
					this.selectedItem.crypto_amount = parseFloat(
						incomingData.data.crypto_amount
					);
					this.selectedItem.crypto_code = incomingData.data.crypto_code;
					this.selectedItem.money = parseFloat(incomingData.data.money);
					this.selectedItem.datetime = incomingData.data.datetime.slice(0, 16);
					// console.log(this.selectedItem);
					this.$store.commit("setShowMainView", 3);
					this.view = view;

					this.cryptoAmountBeforeEdit = this.selectedItem.crypto_amount;
					this.operationPrice =
						this.selectedItem.money / this.selectedItem.crypto_amount;
					this.operationTypeBeforeEdit = this.selectedItem.action;
				})
				.catch(() => {
					this.$store.commit("setShowMainView", 3);
					this.view = 3;
					console.log("Ocurrió un error durante la conexión con el servidor.");
				});
		},
		changeOperation(operation) {
			if (operation.action === "sale") {
				let existsCoin = this.$store.state.userCoins.find(
					(s) => s.crypto_code === operation.crypto_code
				);
				let coinExistency = false;
				if (this.operationTypeBeforeEdit === "purchase") {
					coinExistency =
						existsCoin.purchase.crypto_amount -
							existsCoin.sell.crypto_amount -
							this.cryptoAmountBeforeEdit -
							operation.crypto_amount >=
						0;
				} else {
					coinExistency =
						existsCoin.purchase.crypto_amount -
							existsCoin.sell.crypto_amount +
							this.cryptoAmountBeforeEdit -
							operation.crypto_amount >=
						0;
				}
				console.log(
					existsCoin.purchase.crypto_amount,
					existsCoin.sell.crypto_amount,
					this.cryptoAmountBeforeEdit,
					operation.crypto_amount
				);
				if (coinExistency) {
					this.$store.commit("setShowMainView", 2);
					laboAPI
						.editOperation(operation)
						.then(() => {
							this.$store.dispatch("getUserMovements");
							this.view = 1;
						})
						.catch(() => {
							this.$store.commit("setShowMainView", 3);
							this.view = 3;
							console.log(
								"Ocurrió un error durante la conexión con el servidor."
							);
						});
				} else {
					this.view = 6;
				}
			} else {
				this.$store.commit("setShowMainView", 2);
				laboAPI
					.editOperation(operation)
					.then(() => {
						this.$store.dispatch("getUserMovements");
						this.view = 1;
					})
					.catch(() => {
						this.$store.commit("setShowMainView", 3);
						this.view = 3;
						console.log(
							"Ocurrió un error durante la conexión con el servidor."
						);
					});
			}
		},
	},
};
</script>

<style scoped>
.title-container {
	display: flex;
	flex-direction: row;
	background-color: #9bdc28;
	border-radius: 10px;
	justify-content: space-between;
	align-items: center;
	text-align: center;
	margin-top: 19.92px;
	margin-bottom: 19.92px;
}

.title-container h2 {
	width: 100%;
	margin: 0px;
}

.title-container button {
	width: 50px;
	height: 100%;
}

.v-enter-from {
	transform: translateY(200px);
	opacity: 0;
}

.v-enter-active {
	transition: all 0.3s ease-out;
}

.v-enter-to {
	opacity: 1;
}

.v-leave-from {
	opacity: 1;
}

.v-leave-active {
	transition: all 0.5s ease-in;
}

.v-leave-to {
	transform: translateY(200px);
	opacity: 0;
}

.form-container {
	/* width: 100%; */
	display: flex;
	justify-content: center;
}

.separation {
	border-top-style: dashed;
	padding-top: 15px;
}

.chartContainer {
	display: flex;
	flex-direction: row;
	justify-content: center;
}
.chart {
	width: 500px;
}
</style>
