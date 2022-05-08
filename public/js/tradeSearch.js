(function ($) {

    var originalCode = "";
    var toVerifyCode = "";
    

    $("#button-addon").click(function (event) {
        event.preventDefault();
        let assetType = $("#inputAssetType option:selected").val().trim();
        let searchCode = $("#inputStockCode").val().trim();
        searchCode = searchCode.toUpperCase();
        if (searchCode) {
            if (assetType === "Stock") {
                var searchConfig = {
                  method: "GET",
                  url: `https://financialmodelingprep.com/api/v3/quote/${searchCode}?apikey=14bf083323c7d4f37ef667f48d105a93`,
                };
            } else {
                var searchConfig = {
                  method: "GET",
                  url: `http://localhost:3000/crypto/getPrice/${searchCode}`,
                };
                $("#tradeForm").attr("action", "/crypto/tradecrypto");
            }
        
            $.ajax(searchConfig).then(function (responseMessage) {
                var stockInfo = $(responseMessage);
                if (stockInfo.length === 0) {
                    alert("No Stock/Crypto found.");
                } else {
                    $("#inputStockPrice").val(stockInfo[0].price);
                    $("#inputStockName").val(stockInfo[0].name);
                    originalCode = searchCode;
                }
            });
        } else {
                alert("No code input.")
        }
    });

    $(document).ready(function(){
        $("#submitBtn").click(function (event) {
            event.preventDefault();
            toVerifyCode = $("#inputStockCode").val().trim();
            if (originalCode.toUpperCase() !== toVerifyCode.toUpperCase()) {
              alert("Use search first after code changed!");
            } else {
              originalCode = "";
              toVerifyCode = "";
              $("#tradeForm").submit();
            }
        });
     });

})(window.jQuery);