import { createRouter, createWebHistory } from "vue-router";
import CurrentStatus from "../views/CurrentStatus.vue";
import Coins from "../views/Coins.vue";
// import Operations from "../views/Operations.vue";

const routes = [
  {
    path: "/",
    name: "CurrentStatus",
    component: CurrentStatus,
  },
  {
    path: "/coins",
    name: "Coins",
    component: Coins,
  },
  // {
  // 	path: "/operations",
  // 	name: "Operations",
  // 	component: Operations,
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
