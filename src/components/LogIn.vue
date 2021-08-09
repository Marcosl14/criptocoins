<template>
	<div id="formContainer">
		<form class="form" @submit.prevent="logIn()">
			<div class="title">Bienvenido!</div>
			<div class="subtitle">Ingrese su usuario</div>
			<div class="input-container ic2">
				<input class="input" type="text" v-model="user" @input="validateUser" />
				<div class="cut cut-short"></div>
				<label class="placeholder">User</label>
				<transition>
					<label class="alertText" v-if="userValidation"
						><i>* El usuario debe ser alfanumérico *</i></label
					>
				</transition>
			</div>
			<input type="submit" class="submit" :disabled="userValidation" />
		</form>
	</div>
</template>

<script>
export default {
	name: "LogIn",
	data() {
		return {
			userValidation: true,
			user: "",
		};
	},
	methods: {
		logIn() {
			this.$emit("log-in", this.user);
		},
		// validateMail() {
		// 	let expReg = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
		// 	if (expReg.test(this.mail)) {
		// 		this.mailValidation = false;
		// 	} else {
		// 		this.mailValidation = true;
		// 	}
		// },

		validateUser() {
			let expReg = /^[a-zA-Z0-9]*$/;
			if (expReg.test(this.user)) {
				this.userValidation = false;
			} else {
				this.userValidation = true;
			}
		},
	},
};
</script>

<style scoped>
#formContainer {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding: 20px;
	height: 90vh;
}

.form {
	background-color: #15172b;
	border-radius: 20px;
	box-sizing: border-box;
	height: 350px;
	padding: 20px;
	width: 320px;
}

.title {
	color: #eee;
	font-family: sans-serif;
	font-size: 36px;
	font-weight: 600;
	margin-top: 30px;
}

.subtitle {
	color: #eee;
	font-family: sans-serif;
	font-size: 16px;
	font-weight: 600;
	margin-top: 10px;
}

.input-container {
	height: 50px;
	position: relative;
	width: 100%;
}

.ic1 {
	margin-top: 40px;
}

.ic2 {
	margin-top: 30px;
}

.input {
	background-color: #303245;
	border-radius: 12px;
	border: 0;
	box-sizing: border-box;
	color: #eee;
	font-size: 18px;
	height: 100%;
	outline: 0;
	padding: 4px 20px 0;
	width: 100%;
}

.cut {
	background-color: #15172b;
	border-radius: 10px;
	height: 20px;
	left: 20px;
	position: absolute;
	top: -20px;
	transform: translateY(0);
	transition: transform 200ms;
	width: 76px;
}

.cut-short {
	width: 50px;
}

.input:focus ~ .cut,
.input:not(:placeholder-shown) ~ .cut {
	transform: translateY(8px);
}

.placeholder {
	color: #65657b;
	font-family: sans-serif;
	left: 20px;
	line-height: 14px;
	pointer-events: none;
	position: absolute;
	transform-origin: 0 50%;
	transition: transform 200ms, color 200ms;
	top: 20px;
}

.input:focus ~ .placeholder,
.input:not(:placeholder-shown) ~ .placeholder {
	transform: translateY(-30px) translateX(10px) scale(0.75);
}

.input:not(:placeholder-shown) ~ .placeholder {
	color: #808097;
}

.input:focus ~ .placeholder {
	color: #dc2f55;
}

.submit {
	background-color: #08d;
	border-radius: 12px;
	border: 0;
	box-sizing: border-box;
	color: #eee;
	cursor: pointer;
	font-size: 18px;
	height: 50px;
	margin-top: 38px;
	outline: 0;
	text-align: center;
	width: 100%;
}

.submit:active {
	background-color: #06b;
}

.submit:disabled {
	background-color: rgba(0, 102, 187, 0.3);
}

.alertText {
	color: red;
	font-size: 12px;
}

.v-enter-from {
	transform: translateX(-200px);
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
	transform: translateX(200px);
	opacity: 0;
}
</style>
