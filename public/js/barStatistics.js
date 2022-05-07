(function ($) {
  var searchConfig = {
    method: "GET",
    url: `http://localhost:3000/statistics/bardata`,
  };

  $.ajax(searchConfig).then(function (responseMessage) {
    var finalData = $(responseMessage);
    new Chart("barChart", {
      type: "bar",
      data: {
        labels: finalData[0].xValues,
        datasets: [
          {
            backgroundColor: finalData[0].barColors,
            data: finalData[0].yValues,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "World Wine Production 2018",
        },
      },
    });
  });
})(window.jQuery);
