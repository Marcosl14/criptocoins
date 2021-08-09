<template>
	<table class="fl-table">
		<thead>
			<tr>
				<th>Agencia</th>
				<th>Compra</th>
				<th>Venta</th>
				<th>Operaciones</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="exchanger in Object.keys(exchangers)" :key="exchanger">
				<td>{{ exchanger.toUpperCase() }}</td>
				<td>
					{{ purchasePrice(exchanger) }}
				</td>
				<td>
					{{ sellPrice(exchanger) }}
				</td>
				<td>
					<button @click="operation(exchanger, 'comprar')">Comprar</button>
					<button @click="operation(exchanger, 'vender')">Vender</button>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
export default {
	name: "Agencies",
	props: {
		exchangers: {
			required: true,
		},
	},
	computed: {
		purchasePrice() {
			return (exchanger) => {
				return Intl.NumberFormat("es-Es", {
					style: "currency",
					currency: "ARS",
				}).format(this.exchangers[exchanger].totalAsk);
			};
		},
		sellPrice() {
			return (exchanger) => {
				return Intl.NumberFormat("es-Es", {
					style: "currency",
					currency: "ARS",
				}).format(this.exchangers[exchanger].totalBid);
			};
		},
	},
	methods: {
		operation(exchanger, type) {
			this.$emit("operation", exchanger, type);
		},
	},
};
</script>

<style scoped>
.table-wrapper {
	margin: 10px 70px 70px;
	box-shadow: 0px 35px 50px rgba(0, 0, 0, 0.2);
}

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
</style>
