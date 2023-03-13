document.addEventListener('DOMContentLoaded', function() {

    // gets stock names and symbols from the nasdaq exchange
    var stockData = [];
    fetch('https://finnhub.io/api/v1/stock/symbol?exchange=US&mic=XNAS&token=cg370ipr01qh2qlfe4r0cg370ipr01qh2qlfe4rg')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                for(let i = 0; i < data.length; i++) { 
                    let myObject = {
                        Name: data[i].description,
                        Symbol: data[i].symbol
                    }; 
                    stockData.push(myObject); 
                } 
                marketsList(stockData);
                searchFunction();
                searchListener();
            });
        } else {
            alert('error');
        }
    })
    .catch(function () {
        alert('Unable to connect to finnhub');
    });
       
    // Generate stock list
    function marketsList(data) {
        var $stockList = $('#stock-list');
         // Generate list
        $.each(data, function(index, stock) {
            var $stockItem = $('<li>').text(stock.Name).data('symbol', stock.Symbol);
            $stockList.append($stockItem);
        });
    }  
    
    // Search function
    function searchFunction() {
        $('#search-box').on('keyup', function() {
            var value = $(this).val().toLowerCase();
            $('#stock-list li').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    }
    
    // Click event 
    function searchListener() {
    $('#stock-list li').on('click', function() {
        var symbol = $(this).data('symbol');
        $('#search-box').val('');
        $('#stock-list li').show();
        console.log(symbol);
        
        fetch("https://finnhub.io/api/v1/quote?symbol=" + symbol + "&token=cg370ipr01qh2qlfe4r0cg370ipr01qh2qlfe4rg")
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        console.log(data);
                    });
                } else {
                    alert('error');
                }
            })
        // gets historical data from alpha vantage api
        fetch("https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" + symbol + "&apikey=ECSVW0D22JG4GNHG")
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        console.log(data);
                    });
                } else {
                    alert('error');
                }
            })
            .catch(function() {
                alert('Unable to connect to finnhub');
            });
    });
}
});




// // gets forex names and symbols
// var forexData = [];
// fetch('https://finnhub.io/api/v1/forex/symbol?exchange=OANDA&token=cg370ipr01qh2qlfe4r0cg370ipr01qh2qlfe4rg')
// .then(function (response) {
//     if (response.ok) {
//         response.json().then(function (data) {
            
//             for(let i = 0; i < data.length; i++) {
//                 let myObject = {
//                     Name: data[i].description.replace('Oanda ', ''),
//                     Symbol: data[i].displaySymbol
//                 }; 
//                 forexData.push(myObject);
//                 //
//             } 
//             //console.log(forexData);
            
//         });
//     } else {
//         alert('error');
//     }
// })
// .catch(function () {
//     alert('Unable to connect to finnhub');
// });

// // gets crypto names and symbols
// var cryptoData = [];
// fetch('https://api.coinbase.com/v2/assets/search?query=&country=&currencies=&type=CRYPTO&limit=100&offset=0')
// .then(function (response) {
//     if (response.ok) {
//         response.json().then(function (data) {
        
//             for(let i = 0; i < data.data.length; i++) {
//                 let myObject = {
//                     Name: data.data[i].name,
//                     Symbol: data.data[i].symbol
//                 }; 
//                 cryptoData.push(myObject);
                
//             } 
//             //console.log(cryptoData);
            
//         });
//     } else {
//         alert('error');
//     }
// })
// .catch(function () {
//     alert('Unable to connect to finnhub');
// });

// // gets bond names and symbols
// var bondData = [];
// fetch('https://finnhub.io/api/v1/search?q=bond&exchange=US&token=cg370ipr01qh2qlfe4r0cg370ipr01qh2qlfe4rg')
// .then(function (response) {
//     if (response.ok) {
//         response.json().then(function (data) {
            
//             for(let i = 0; i < data.result.length; i++) {
//                 let myObject = {
//                     Name: data.result[i].description,
//                     Symbol: data.result[i].symbol
//                 }; 
//                 bondData.push(myObject);
//             } 
//             //console.log(bondData);
//         });
//     } else {
//         alert('error');
//     }
// })
// .catch(function () {
//     alert('Unable to connect to finnhub');
// });