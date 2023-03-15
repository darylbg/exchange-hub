document.addEventListener('DOMContentLoaded', function() {
    
    // gets stock names and symbols from the nasdaq exchange 
    // initialize empty array for api data
    var stockData = [];
    function completeDAta() {
    fetch('https://finnhub.io/api/v1/stock/symbol?exchange=US&mic=XNAS&token=cg370ipr01qh2qlfe4r0cg370ipr01qh2qlfe4rg')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
              // takes name and symbol data from api and stores it in a json object
                for(let i = 0; i < data.length; i++) { 
                    let myObject = {
                        Name: data[i].description,
                        Symbol: data[i].symbol
                    }; 
                    // pushed json object to initializes array stock data
                    stockData.push(myObject); 
                } 
                // call various functions
                marketsList(stockData);
                searchFunction();
                searchListener();
            });
        } else {
            console.log('error');
        }
    })
    .catch(function () {
        console.log('Unable to connect to finnhub');
    });
  } completeDAta();
       
  // Generate stock list
  function marketsList(data) {
      var $stockList = $('#stock-list');
      $stockList.empty();
       // create html list items and displays stock data to them
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
    
    // initializes array for historical api data
    var historicalData = [];
    // set variable symbol to global
    var symbol;
    // function to historical data for selected stock
    function searchListener() {
    $('#stock-list li').on('click', function() {
        symbol = $(this).data('symbol');
        $('#search-box').val('');
        $('#stock-list li').show();
        $('#chart-title').text($(this).text());

        historicalData = [];
        
        // gets historical data from alpha vantage api
        fetch("https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=" + symbol + "&apikey=ECSVW0D22JG4GNHG")
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                      // gets date and closing price values from api and pushes to the empty historical data array 
                        var monthlyTimeSeries = data['Monthly Time Series'];
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
                    console.log('error');
                }
            })
            .catch(function() {
                console.log('Unable to connect to finnhub');
            });
    });
}
// looks for local storag and sets an empty array if nothing found
var savedStocks = JSON.parse(localStorage.getItem('stocks')) || [];
// stock chart display stock chart made with chart.js
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
// sorts historical data array in acending order by date
      historicalData.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      historicalData.forEach((dataPoint) => {
        chartData.labels.push(dataPoint.date);
        chartData.datasets[0].data.push(dataPoint.close);
      });
      // set chart paramiters
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
          // creats a save button for each stock chart
          animation: {
            onComplete: function() {
              var button = $('<button/>', {
                text: 'Save',
                click: function() {
                  // when save button is clicked name and symbol is saved to local storage
                    fetch("https://finnhub.io/api/v1/stock/profile2?symbol=" + symbol + "&token=cg370ipr01qh2qlfe4r0cg370ipr01qh2qlfe4rg")
                    .then(function (response) {
                        console.log(symbol);
                        if (response.ok) {
                            response.json().then(function (data) {
                                var Name = data.name;
                                var Symbol = data.ticker;
                                savedStocks.unshift({Name, Symbol});
                                localStorage.setItem('stocks', JSON.stringify(savedStocks));
                            });
                        } else {
                            console.log('error');
                        }
                    })
                }
              });
              // attached button to the dom
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
// function to display locally saved items
    function renderSavedStocks() {
      $('.saved-button').on('click', function() {
        var savedItems = JSON.parse(localStorage.getItem('stocks')) || [];
        $('.reset-button').removeClass('reset-button');
        marketsList(savedItems);
        searchListener();
      });
    }renderSavedStocks();
// hides home button on click
    $('#reset-button').on('click', function() {
      completeDAta();
      $('#reset-button').addClass('reset-button');
    });


});

