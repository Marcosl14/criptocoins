<template>
	<div>
		<table class="fl-table">
			<thead>
				<tr>
					<th>Moneda</th>
					<th>Cantidad en poseción</th>
					<th>Compradas</th>
					<th>*PCP</th>
					<th>Vendidas</th>
					<th>*PVP</th>
					<th>*Ganancia por venta</th>
					<th>Precio Actual</th>
					<th>Monto Actual</th>
					<th>Ganancia</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="movement in $store.state.userCoins"
					:key="movement.crypto_code"
				>
					<td for="Moneda">
						{{ movement.crypto_code.toUpperCase() }}
					</td>
					<td for="Cantidad en poseción">
						{{ posAmount(movement) }}
					</td>
					<td for="Compradas">
						{{ purchasedAmount(movement) }}
					</td>
					<td for="*PCP">
						{{ pcp(movement) }}
					</td>
					<td for="Vendidas">
						{{ soldAmount(movement) }}
					</td>
					<td for="*PVP">
						{{ pvp(movement) }}
					</td>
					<td for="*Ganancia por venta">
						{{ winingsBySell(movement) }}
					</td>
					<td for="Precio Actual">
						{{ currentPrice(movement) }}
					</td>
					<td for="Monto Actual">
						{{ currentAmount(movement) }}
					</td>
					<td for="Ganancia">
						{{ parcialWinings(movement) }}
					</td>
				</tr>
			</tbody>
			<tfoot>
				<tr>
					<td></td>
					<td></td>
					<td>Total Comprado</td>
					<td></td>
					<td>Total Vendido</td>
					<td></td>
					<td>Ganacia por Venta</td>
					<td></td>
					<td>*Total Invertido</td>
					<td>Ganancia Total</td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td for="Total Comprado">
						{{ totalPurchased }}
					</td>
					<td></td>
					<td for="Total Vendido">
						{{ totalSold }}
					</td>
					<td></td>
					<td for="Ganacia por Venta">
						{{ earnedMoneyBySell }}
					</td>
					<td></td>
					<td for="*Total Invertido">
						{{ totalInvested }}
					</td>
					<td for="Ganancia Total">
						{{ totalEarned }}
					</td>
				</tr>
			</tfoot>
		</table>
		<div class="comments">
			<p>*PCP = Precio Compra Promedio</p>
			<p>*PVP = Precio Venta Promedio</p>
			<p>
				*Ganancia por venta en el momento de la venta = (PVP - PCP) * Unidades
				Vendidas
			</p>
			<p>*Total Invertido al precio de venta actual.</p>
		</div>
	</div>
</template>

<script>
export default {
	name: "StatusResume",
	computed: {
		posAmount() {
			return (movement) => {
				return (
					movement.purchase.crypto_amount - movement.sell.crypto_amount
				).toLocaleString("en", {
					useGrouping: false,
					minimumFractionDigits: 2,
					maximumFractionDigits: 5,
				});
			};
		},
		purchasedAmount() {
			return (movement) => {
				return movement.purchase.crypto_amount.toLocaleString("en", {
					useGrouping: false,
					minimumFractionDigits: 2,
					maximumFractionDigits: 5,
				});
			};
		},
		pcp() {
			return (movement) => {
				return Intl.NumberFormat("es-Es", {
					style: "currency",
					currency: "ARS",
				}).format(movement.purchase.money / movement.purchase.crypto_amount);
			};
		},
		soldAmount() {
			return (movement) => {
				return movement.sell.crypto_amount.toLocaleString("en", {
					useGrouping: false,
					minimumFractionDigits: 2,
					maximumFractionDigits: 5,
				});
			};
		},
		pvp() {
			return (movement) => {
				return Intl.NumberFormat("es-Es", {
					style: "currency",
					currency: "ARS",
				}).format(
					!isNaN(movement.sell.money / movement.sell.crypto_amount)
						? (movement.sell.money / movement.sell.crypto_amount).toFixed(2)
						: 0
				);
			};
		},
		winingsBySell() {
			return (movement) => {
				return Intl.NumberFormat("es-Es", {
					style: "currency",
					currency: "ARS",
				}).format(
					!isNaN(movement.sell.money / movement.sell.crypto_amount)
						? (parseFloat(movement.sell.money / movement.sell.crypto_amount) -
								parseFloat(
									movement.purchase.money / movement.purchase.crypto_amount
								)) *
								parseFloat(movement.sell.crypto_amount)
						: 0
				);
			};
		},
		currentPrice() {
			return (movement) => {
				return Intl.NumberFormat("es-Es", {
					style: "currency",
					currency: "ARS",
				}).format(this.getCurrentPrice(movement.crypto_code));
			};
		},
		currentAmount() {
			return (movement) => {
				return Intl.NumberFormat("es-Es", {
					style: "currency",
					currency: "ARS",
				}).format(
					(movement.purchase.crypto_amount - movement.sell.crypto_amount) *
						this.getCurrentPrice(movement.crypto_code)
				);
			};
		},
		getCurrentPrice() {
			return (coinName) => {
				let index = this.$store.state.currentPrices.findIndex(
					(s) => s.coin === coinName
				);
				if (index >= 0) {
					return this.$store.state.currentPrices[index].data.totalBid;
				} else {
					return 0;
				}
			};
		},
		parcialWinings() {
			return (movement) => {
				let wining =
					(movement.purchase.crypto_amount - movement.sell.crypto_amount) *
					(this.getCurrentPrice(movement.crypto_code) -
						movement.purchase.money / movement.purchase.crypto_amount);
				if (wining < 0.01 && wining > -0.01) {
					return 0;
				} else {
					return Intl.NumberFormat("es-Es", {
						style: "currency",
						currency: "ARS",
					}).format(wining);
				}
			};
		},
		totalPurchased() {
			return Intl.NumberFormat("es-Es", {
				style: "currency",
				currency: "ARS",
			}).format(this.$store.getters.getUserInformation.purchaseAmount);
		},
		totalSold() {
			return Intl.NumberFormat("es-Es", {
				style: "currency",
				currency: "ARS",
			}).format(this.$store.getters.getUserInformation.sellAmount);
		},
		earnedMoneyBySell() {
			let earnedAmount = 0;
			for (let coin of this.$store.state.userCoins) {
				if (!isNaN(coin.sell.money / coin.sell.crypto_amount)) {
					earnedAmount +=
						(parseFloat(coin.sell.money / coin.sell.crypto_amount) -
							parseFloat(coin.purchase.money / coin.purchase.crypto_amount)) *
						parseFloat(coin.sell.crypto_amount);
				}
			}
			return Intl.NumberFormat("es-Es", {
				style: "currency",
				currency: "ARS",
			}).format(earnedAmount);
		},
		totalInvested() {
			return Intl.NumberFormat("es-Es", {
				style: "currency",
				currency: "ARS",
			}).format(this.$store.getters.getUserInformation.totalAmount);
		},
		totalEarned() {
			return Intl.NumberFormat("es-Es", {
				style: "currency",
				currency: "ARS",
			}).format(this.$store.getters.getUserInformation.totalWinings);
		},
	},
};
</script>

<style scoped>
.fl-table {
	border-radius: 5px;
	font-size: 12px;
	font-weight: normal;
	border: none;
	border-collapse: collapse;
	width: 100%;
	max-width: 100%;
	white-space: nowrap;
	background-color: white;
	margin-bottom: 15px;
}

.fl-table td,
.fl-table th {
	text-align: center;
	padding: 8px;
}

.fl-table td {
	border-right: 1px solid #f8f8f8;
	font-size: 12px;
}

.fl-table thead th {
	color: #ffffff;
	background: #4fc3a1;
}

.fl-table thead th:nth-child(odd) {
	color: #ffffff;
	background: #324960;
}

.fl-table tr:nth-child(even) {
	background: #f8f8f8;
}

.fl-table tfoot td {
	color: #ffffff;
	background: #4fc3a1;
}

.fl-table tfoot td:nth-child(odd) {
	color: #ffffff;
	background: #324960;
}

.fl-table tfoot tr:nth-child(even) {
	background: #f8f8f8;
}

.fl-table tfoot {
	font-weight: bold;
}

.comments {
	text-align: left;
	font-size: 12px;
	color: red;
	font-weight: bold;
	margin-bottom: 15px;
}

.comments p {
	margin-top: 0px;
	margin-bottom: 5px;
}
</style>
