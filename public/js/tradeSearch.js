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
                    if (stockInfo[0].name) {
                        $("#inputStockName").val(stockInfo[0].name);
                    } else {
                        $("#inputStockName").val(stockInfo[0].symbol);
                    }
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
            let searchCode = $("#inputStockCode").val().trim();
            let quantity = $("#inputQuantity").val();
            if (originalCode.toUpperCase() !== toVerifyCode.toUpperCase()) {
              alert("Please use the search function after changing the code.");
            } else if (!searchCode) {
              alert("Please input the Code."); 
            } else if (!quantity) {
              alert("Please input the quantity.");  
            } else {
              originalCode = "";
              toVerifyCode = "";
              $("#tradeForm").submit();
            }
        });
     });

})(window.jQuery);