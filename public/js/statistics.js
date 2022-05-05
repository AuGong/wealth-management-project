// // Chart.register(ChartDataLabels);
// // var options = {
// //   tooltips: {
// //       enabled: false
// //   },
// //   plugins: {
// //       datalabels: {
// //           formatter: (value, ctx) => {
// //               let sum = 0;
// //               let dataArr = ctx.chart.data.datasets[0].data;
// //               dataArr.map(data => {
// //                   sum += data;
// //               });
// //               let percentage = (value*100 / sum).toFixed(2)+"%";
// //               return percentage;
// //           },
// //           color: '#fff',
// //       }
// //   }
// // };

// $(document).ready(function() {
// var xValues = ["APPL", "GOOGL", "TSLA", "FB", "AMZN"];
// var yValues = [13, 21, 22, 33, 11];
// var barColors = [
//   "#b91d47",
//   "#00aba9",
//   "#2b5797",
//   "#e8c3b9",
//   "#1e7145"
// ];

// var ctx1 = document.getElementById("myChart1").getContext('2d');
// console(ctx1);

// var myChart1 = new Chart(ctx1, {
//   type: "pie",
//   data: {
//     labels: xValues,
//     datasets: yValues
//   },
//   options: options
// });

// var options = {
//   tooltips: {
//     enabled: false
//   },
//   plugins: {
//     datalabels: {
//       formatter: (value, ctx1) => {
//         let datasets = ctx1.chart.data.datasets;
//         if (datasets.indexOf(ctx1.dataset) === datasets.length - 1) {
//           let sum = datasets[0].data.reduce((a, b) => a + b, 0);
//           let percentage = Math.round((value / sum) * 100) + '%';
//           return percentage;
//         } else {
//           return percentage;
//         }
//       },
//       color: '#fff',
//     }
//   }
// };



// var xValues2 = ["APPL", "GOOGL", "TSLA", "FB", "AMZN", "Total"];
// var yValues2 = [0.33, -0.21, 0.42, 1.33, -1.51, 1, 22];
// var barColors2 = ["red", "green","blue","orange","brown"];


// var ctx2 = document.getElementById("myChart2").getContext('2d');
// console(ctx2);
// var myChart2 = new Chart(ctx2, {
//   type: "bar",
//   data: {
//     labels: xValues2,
//     datasets: yValues2
//   },
//   options: options2
  
  
// });

// var options2 = {
//   tooltips: {
//     enabled: false
//   },
//   plugins: {
//     datalabels: {
//       formatter: (value, ctx2) => {
//         let datasets = ctx2.chart.data.datasets;
//         if (datasets.indexOf(ctx2.dataset) === datasets.length - 1) {
//           let sum = datasets[0].data.reduce((a, b) => a + b, 0);
//           let percentage = Math.round((value / sum) * 100) + '%';
//           return percentage;
//         } else {
//           return percentage;
//         }
//       },
//       color: '#fff',
//     }
//   }
// }
// });

var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
var yValues = [55, 49, 44, 24, 15];
var barColors = [
  "#b91d47",
  "#00aba9",
  "#2b5797",
  "#e8c3b9",
  "#1e7145"
];

new Chart("myChart", {
  type: "pie",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    title: {
      display: true,
      text: "World Wide Wine Production 2018"
    }
  }
});