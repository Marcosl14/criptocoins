<script>
import { defineComponent } from "vue";
import { Doughnut } from "vue3-chart-v2";

export default defineComponent({
  name: "MonthlyChart",
  extends: Doughnut,
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: this.$store.getters.getCurrentUserCoins.coins,
      datasets: [
        {
          backgroundColor: [
            "red",
            "blue",
            "green",
            "orange",
            "darkblue",
            "violet",
            "cian",
            "black",
          ],
          // borderColor: [
          // 	"rgba(255, 99, 132, 1)",
          // 	"rgba(54, 162, 235, 1)",
          // 	"rgba(255, 206, 86, 1)",
          // 	"rgba(75, 192, 192, 1)",
          // 	"rgba(153, 102, 255, 1)",
          // 	"rgba(255, 159, 64, 1)",
          // ],
          data: this.$store.getters.getCurrentUserCoins.amounts,
        },
      ],
      options: {
        responsive: true,
      },
    });
  },
});
</script>
