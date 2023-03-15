document.addEventListener('DOMContentLoaded', function() {
    
    

    // gets stock names and symbols from the nasdaq exchange
    var stockData = [];
    function completeDAta() {
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
                console.log(stockData);
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
  } completeDAta();
       
    // Generate stock list
    function marketsList(data) {
        var $stockList = $('#stock-list');
        $stockList.empty();
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
    var historicalData = [];
    
    var symbol;
    
    function searchListener() {
    $('#stock-list li').on('click', function() {
        symbol = $(this).data('symbol');
        console.log(symbol);
        console.log($(this).text());
        $('#search-box').val('');
        $('#stock-list li').show();
        $('#chart-title').text($(this).text());
        
        // gets historical data from alpha vantage api
        fetch("https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=" + symbol + "&apikey=ECSVW0D22JG4GNHG")
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        var monthlyTimeSeries = data['Monthly Time Series'];
                        console.log(data);
                        for (let date in monthlyTimeSeries) {
                            if (monthlyTimeSeries.hasOwnProperty(date)) {
                                var monthlyData = monthlyTimeSeries[date];
                                var closePrice = parseFloat(monthlyData['4. close']);
                                historicalData.push({date, close: closePrice});
                            }
                        }
                        clearChart();
                        stockChart();
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

var savedStocks = JSON.parse(localStorage.getItem('stocks')) || [];
// stock chart display
var myChart;
function stockChart() {
    var chartData = {
        labels: [],
        datasets: [{
          label: '$',
          data: [],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };

      historicalData.sort((a, b) => new Date(a.date) - new Date(b.date)); //sort data in ascending order by date
      
      historicalData.forEach((dataPoint) => {
        chartData.labels.push(dataPoint.date);
        chartData.datasets[0].data.push(dataPoint.close);
      });
      
      var ctx = document.getElementById('myChart').getContext('2d');
      ctx.canvas.width = '100%';
      myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              display: true
            },
            y: {
              display: true
            }
          },
          animation: {
            onComplete: function() {
              var button = $('<button/>', {
                text: 'Save',
                click: function() {
                    fetch("https://finnhub.io/api/v1/stock/profile2?symbol=" + symbol + "&token=cg370ipr01qh2qlfe4r0cg370ipr01qh2qlfe4rg")
                    .then(function (response) {
                        console.log(symbol);
                        if (response.ok) {
                            response.json().then(function (data) {
                                console.log(data);
                                var Name = data.name;
                                var Symbol = data.ticker;
 
                                savedStocks.unshift({Name, Symbol});
                                
                                localStorage.setItem('stocks', JSON.stringify(savedStocks));
                            });
                        } else {
                            alert('error');
                        }
                    })
                }
              });
              $('.chart-container').append(button);
            }
          }
        }
      });
    }
    // clear chart if one exists
    function clearChart() {
        if (myChart) {
          myChart.destroy();
        }
      }

    function renderSavedStocks() {
      $('.saved-button').on('click', function() {
        var savedItems = JSON.parse(localStorage.getItem('stocks')) || [];
        $('.reset-button').removeClass('reset-button');
        console.log(savedItems);
        marketsList(savedItems);
        searchListener();
      });
    }
    
    renderSavedStocks();

    $('#reset-button').on('click', function() {
      completeDAta();
      $('#reset-button').addClass('reset-button');
    });


});

