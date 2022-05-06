(function ($) {

    

    $("#button-addon").click(function (event) {
        event.preventDefault();
        let assetType = $("#inputAssetType option:selected").val().trim();
        let searchCode = $("#inputStockCode").val().trim();
        searchCode = searchCode.toUpperCase();
        if (searchCode) {
            if (assetType === "Stock") {
                var searchConfig = {
                    method: "GET",
                    url: `https://financialmodelingprep.com/api/v3/quote/${searchCode}?apikey=4116b7eb972d010e408e5e350e723b1a`,
                };
            } else {
                var searchConfig = {
                  method: "GET",
                  url: `https://financialmodelingprep.com/api/v3/quote/${searchCode}USD?apikey=4116b7eb972d010e408e5e350e723b1a`,
                };
                $("#tradeForm").attr("action", "/crypto/tradecrypto");
            }
        
            $.ajax(searchConfig).then(function (responseMessage) {
                var stockInfo = $(responseMessage);
                $("#inputStockPrice").val(stockInfo[0].price);
                $("#inputStockName").val(stockInfo[0].name);
            });
        } else {
                alert("No code input.")
        }
    });


})(window.jQuery);