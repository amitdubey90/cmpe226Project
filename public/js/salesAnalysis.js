google.load("visualization", "1.1", {packages:["bar"]});
      google.setOnLoadCallback(drawChart);
      function drawChart() {

        $.getJSON('/adminrest/admin/salesZipcode', function (response) {
            console.log(JSON.stringify(response))
            var data = google.visualization.arrayToDataTable([
          ['Zip Codes', 'Sales in USD',],

          [''+response[0].CustomerZipCode, response[0].sales ],
          [response[1].CustomerZipCode, response[1].sales ],
          [response[2].CustomerZipCode, response[2].sales ],
          [response[3].CustomerZipCode, response[3].sales ],
          [response[4].CustomerZipCode, response[4].sales ]
        ]);

        var options = {
          chart: {
            title: '',
            subtitle: ''
          },
          bars: 'horizontal' // Required for Material Bar Charts.
        };

        var chart = new google.charts.Bar(document.getElementById('barchart_material'));

        chart.draw(data, options);
        });

        
      }