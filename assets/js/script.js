
document.addEventListener('DOMContentLoaded', function() {
    var symbol = "BTC";
    var searchButton = $("#search-button");
    var searchInput = $("#search-input");
    var searchText;


    searchButton.click(function() {
        searchText = searchInput.val().trim();

        console.log(searchText);

        fetch("https://finnhub.io/api/v1/quote?symbol=" + searchText + "&token=cg370ipr01qh2qlfe4r0cg370ipr01qh2qlfe4rg")
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        console.log(data);
                    });
                } else {
                    alert('error');
                }
            })
            .catch(function (error) {
                alert('Unable to connect to finnhub');
            });

    }); 
    $('input.autocomplete').autocomplete({
        data: {
          "Apple": "AAPL",
          "Microsoft": null,
          "Google": 'https://placehold.it/250x250'
        },
      });
});