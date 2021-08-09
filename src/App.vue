<template>
	<div>
		<div id="nav" v-if="showMainView === 3">
			<div>
				<router-link to="/">Estado Actual</router-link> |
				<router-link to="/coins">Comprar / Vender</router-link>
				<!-- <router-link to="/operations">Compra / Venta</router-link> -->
			</div>
			<div>
				<label>Usuario : {{ $store.state.user }}</label>
				<button @click="cambiarUsuario">Cambiar</button>
			</div>
		</div>
		<div class="content">
			<router-view v-show="showMainView === 3" />
			<h3 v-if="showMainView === 2">
				Aguarde un momento, por favor. <br />
				Estamos procesando su solicitud.
			</h3>
			<img
				src="https://i.giphy.com/media/RiiJjKAQbN4XLDBOhR/giphy.webp"
				v-if="showMainView === 2"
			/>
			<LogIn class="log-in" @log-in="logIn" v-if="showMainView === 1"></LogIn>
		</div>
	</div>
</template>

<script>
import LogIn from "./components/LogIn.vue";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
	components: {
		LogIn,
	},
	computed: mapState({
		showMainView: (state) => state.showMainView,
	}),
	methods: {
		...mapActions(["getCoins", "getUserMovements", "getCurrentPrices"]),
		...mapMutations([
			"setUserMovements",
			"setUser",
			"setShowMainView",
			"setUserCoins",
		]),
		cambiarUsuario() {
			this.setUser("");
			this.setUserMovements([]);
			this.setUserCoins([]);
			this.setShowMainView(1);
		},
		logIn(componentUser) {
			this.setUser(componentUser);
			this.getCoins();
			this.getUserMovements();
			this.getCurrentPrices();
			this.setShowMainView(2);
		},
	},
};
</script>

<style>
body {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	height: 100vh;
	min-width: 550px;
	margin: 0px;
	box-sizing: border-box;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	width: 100%;
}

#nav {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 12px;
	align-items: center;
	background-color: #9bdc28;
	/* border-radius: 10px; */
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 50000;
	border-color: #2c3e50;
	border-bottom-style: solid;
	/* margin: 10px; */
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
	/* margin: 5px; */
}

#nav label {
	font-weight: bold;
	color: #2c3e50;
}

#nav button {
	font-weight: bold;
	color: #2c3e50;
	border-style: none;
	background-color: transparent;
	font-size: 16px;
	text-decoration: underline;
	cursor: pointer;
}

#nav a.router-link-exact-active {
	color: #424ab9;
}

.content {
	margin: 10px;
	margin-top: 75px;
}

.content > h3 {
	position: fixed;
	top: 40%;
	width: 100%;
}

h2 {
	background-color: #9bdc28;
	border-radius: 10px;
	padding: 5px;
}

button {
	padding: 5px 15px;
	background: #fff;
	border-radius: 4px;
	font-weight: 600;
	color: #111;
	margin-right: 10px;
	background: #9bdc28;
}

button:hover {
	color: #ffffff;
	background: #324960;
}

button:disabled {
	background: #9bdc28;
	opacity: 0.5;
}

button:disabled:hover {
	color: #111;
}

.log-in {
	position: fixed;
	top: 0px;
	width: 100%;
}

.disabled {
	opacity: 0.5;
	pointer-events: none;
}
</style>
