document.addEventListener('DOMContentLoaded', function() {
    // gets forex names and symbols
    var forexData = [];
    fetch('https://finnhub.io/api/v1/forex/symbol?exchange=OANDA&token=cg370ipr01qh2qlfe4r0cg370ipr01qh2qlfe4rg')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                
                for(let i = 0; i < data.length; i++) {
                    let myObject = {
                        Name: data[i].description.replace('Oanda ', ''),
                        Symbol: data[i].displaySymbol
                    }; 
                    forexData.push(myObject);
                    //
                } console.log(forexData);
            });
        } else {
            alert('error');
        }
    })
    .catch(function () {
        alert('Unable to connect to finnhub');
    });
    

    // gets bond names and symbols
    var bondData = [];
    fetch('https://finnhub.io/api/v1/search?q=bond&exchange=US&token=cg370ipr01qh2qlfe4r0cg370ipr01qh2qlfe4rg')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                
                for(let i = 0; i < data.result.length; i++) {
                    let myObject = {
                        Name: data.result[i].description,
                        Symbol: data.result[i].symbol
                    }; 
                    bondData.push(myObject);
                    
                } console.log(bondData);
            });
        } else {
            alert('error');
        }
    })
    .catch(function () {
        alert('Unable to connect to finnhub');
    });
    

    // gets stock names and symbols from the nasdaq exchange
    var stockData = [];
    fetch('https://finnhub.io/api/v1/stock/symbol?exchange=US&mic=XNAS&token=cg370ipr01qh2qlfe4r0cg370ipr01qh2qlfe4rg')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                //console.log(data);
                
                for(let i = 0; i < data.length; i++) { 
                    let myObject = {
                        Name: data[i].description,
                        Symbol: data[i].symbol
                    }; 
                    stockData.push(myObject);
                    
                } console.log(stockData);
            });
        } else {
            alert('error');
        }
    })
    .catch(function () {
        alert('Unable to connect to finnhub');
    });
    

    // gets crypto names and symbols
    var cryptoData = [];
    fetch('https://api.coinbase.com/v2/assets/search?query=&country=&currencies=&type=CRYPTO&limit=100&offset=0')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
            
                for(let i = 0; i < data.data.length; i++) {
                    let myObject = {
                        Name: data.data[i].name,
                        Symbol: data.data[i].symbol
                    }; 
                    cryptoData.push(myObject);
                    
                } console.log(cryptoData);
            });
        } else {
            alert('error');
        }
    })
    .catch(function () {
        alert('Unable to connect to finnhub');
    });
    

      // Create stock data
    var stockData = [
        { name: 'Apple Inc.', symbol: 'AAPL' },
        { name: 'Amazon.com Inc.', symbol: 'AMZN' },
        { name: 'Alphabet Inc.', symbol: 'GOOGL' },
        { name: 'Microsoft Corporation', symbol: 'MSFT' },
        { name: 'Facebook Inc.', symbol: 'FB' },
        { name: 'Tesla Inc.', symbol: 'TSLA' }
    ];
    
    // Generate stock list
    function marketsList() {
        var $stockList = $('#stock-list');
    $.each(stockData, function(index, stock) {
        var $stockItem = $('<li>').text(stock.name).data('symbol', stock.symbol);
        $stockList.append($stockItem);
    });
    } marketsList();
    

    // Search function
    $('#search-box').on('keyup', function() {
        var value = $(this).val().toLowerCase();
        $('#stock-list li').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    
    // Click event
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
                .catch(function() {
                    alert('Unable to connect to finnhub');
                });
    });
});