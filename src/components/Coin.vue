<template>
	<div>
		<div class="container">
			<div class="card">
				<div class="imgBx">
					<img :src="coin.image.large" />
				</div>
				<div class="contentBx">
					<h3>{{ coinDescrition }}</h3>
					<button @click="seeExchangers">Ver Agencias</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Coin",
	props: {
		coin: {
			required: true,
		},
	},
	computed: {
		coinDescrition() {
			return this.coin.name + " (" + this.coin.symbol.toUpperCase() + ")";
		},
	},
	methods: {
		seeExchangers() {
			this.$emit("see-exchangers", this.coin);
		},
	},
};
</script>

<style scoped>
.container {
	position: relative;
	margin: 5px;
}

.container .card {
	position: relative;
	width: 250px;
	height: 320px;
	background: #232323;
	border-radius: 20px;
	overflow: hidden;
}

.container .card:before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #9bdc28;
	clip-path: circle(150px at 80% 20%);
	transition: 0.5s ease-in-out;
}

.container .card:hover:before {
	clip-path: circle(300px at 80% -20%);
}

.container .card:after {
	content: "u$s";
	position: absolute;
	top: 30%;
	left: -20%;
	font-size: 12em;
	font-weight: 800;
	font-style: italic;
	color: rgba(255, 255, 25, 0.05);
}

.container .card .imgBx {
	position: absolute;
	top: 50%;
	transform: translateY(-75%);
	z-index: 10000;
	width: 100%;
	height: 220px;
	transition: 0.5s;
}

.container .card:hover .imgBx {
	top: 0%;
	transform: translateY(-10%);
}

.container .card .imgBx img {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) rotate(-25deg);
	width: 150px;
}

.container .card .contentBx {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 100px;
	text-align: center;
	transition: 1s;
	z-index: 10;
}

.container .card:hover .contentBx {
	height: 100px;
}

.container .card .contentBx h3 {
	position: relative;
	font-weight: 600;
	letter-spacing: 1px;
	color: #fff;
	margin: 0;
}

.container .card .contentBx button {
	display: inline-block;
	padding: 10px 20px;
	background: #fff;
	border-radius: 4px;
	font-weight: 600;
	color: #111;
	opacity: 0;
	transform: translateY(50px);
	transition: 0.5s;
	margin: 10px;
	background: #9bdc28;
}

.container .card:hover .contentBx button {
	opacity: 1;
	transform: translateY(0px);
	transition-delay: 0.1s;
}
</style>
