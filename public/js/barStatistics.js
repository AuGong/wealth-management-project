(function ($) {
  var searchConfig = {
    method: "GET",
    url: `http://localhost:3000/statistics/bardata`,
  };

  $.ajax(searchConfig).then(function (responseMessage) {
    var finalData = $(responseMessage);
    new Chart("barChartStock", {
      type: "bar",
      data: {
        labels: finalData[0].stockxValues,
        datasets: [
          {
            backgroundColor: finalData[0].stockbarColors,
            data: finalData[0].stockyValues,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "Stock Net Profits by stock code",
        },
      },
    });

    new Chart("barChartCrypto", {
      type: "bar",
      data: {
        labels: finalData[0].cryptoxValues,
        datasets: [
          {
            backgroundColor: finalData[0].cryptobarColors,
            data: finalData[0].cryptoyValues,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "Crypto Net Profits by crypto code",
        },
      },
    });

    new Chart("pieChartStock", {
      type: "pie",
      data: {
        labels: finalData[0].stockxValues,
        datasets: [
          {
            backgroundColor: finalData[0].stockbarColors,
            data: finalData[0].stockyPieValues,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "Stock Weights by asset quantity",
        },
      },
    });

    new Chart("pieChartCrypto", {
      type: "pie",
      data: {
        labels: finalData[0].cryptoxValues,
        datasets: [
          {
            backgroundColor: finalData[0].cryptobarColors,
            data: finalData[0].cryptoyPieValues,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "Crypto Weights by asset quantity",
        },
      },
    });
  });
})(window.jQuery);
