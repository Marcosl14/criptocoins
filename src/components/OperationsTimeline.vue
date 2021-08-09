<template>
	<div>
		<table class="fl-table">
			<thead>
				<tr>
					<th>Indice</th>
					<th>Moneda</th>
					<th>Cantidad</th>
					<th>Precio de Compra / Venta</th>
					<th>Monto</th>
					<th>Tipo de Operación</th>
					<th>Fecha de la Operación</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(movement, index) in $store.state.userMovements"
					:key="movement._id"
				>
					<td for="Indice">{{ index + 1 }}</td>
					<td for="Moneda">
						{{ movement.crypto_code.toUpperCase() }}
					</td>
					<td for="Cantidad">{{ movement.crypto_amount }}</td>
					<td for="Precio de Compra / Venta">
						{{ operationPrice(movement) }}
					</td>
					<td for="Monto Adquirido">
						{{ operationAmount(movement) }}
					</td>
					<td for="Tipo de Operación">
						{{ movement.action === "purchase" ? "Compra" : "Venta" }}
					</td>
					<td for="Fecha de la Operación">
						{{ operationDate(movement) }}
					</td>
					<td for="Acciones">
						<button @click="operation(movement, 5)">Ver</button>
						<button @click="operation(movement, 4)">Editar</button>
						<button @click="remove(movement, 2)">Eliminar</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	name: "OperationsTimeline",
	data() {
		return {};
	},
	props: {},
	computed: {
		operationPrice() {
			return (movement) => {
				return Intl.NumberFormat("es-Es", {
					style: "currency",
					currency: "ARS",
				}).format(movement.money / movement.crypto_amount);
			};
		},
		operationAmount() {
			return (movement) => {
				return Intl.NumberFormat("es-Es", {
					style: "currency",
					currency: "ARS",
				}).format(movement.money);
			};
		},
		operationDate() {
			return (movement) => {
				return (
					movement.datetime.substring(8, 10) +
					"-" +
					movement.datetime.substring(5, 7) +
					"-" +
					movement.datetime.substring(0, 4) +
					" / " +
					movement.datetime.substring(11, 13) +
					":" +
					movement.datetime.substring(14, 16)
				);
			};
		},
	},
	methods: {
		operation(movement, view) {
			this.$emit("operation", movement, view);
		},
		remove(movement, view) {
			this.$emit("remove", movement, view);
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
</style>
