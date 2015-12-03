$(function () {
    // Create the chart
    result = [];
    drillArray = [];
    $.getJSON('http://localhost:3000/adminrest/sales/drillForQuarter', function (data) {
        quarter = 1;
        var monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];
        totalSum = 0;
        for ( i = 0; i< data.length; i = i+ 1) {
            totalSum += data[i].unitsSold
        }

        for ( i = 0; i< data.length; i = i+ 3) {    
            innerSum = 0;
            for(j = i; j< i+3; j++) {
                innerSum += data[j].unitsSold
            }

            for(j = i; j< i+3; j++) {
                drillArray.push([monthNames[j], data[j].unitsSold/innerSum*100])
            }

            temp = {
                    name : "Quarter "+quarter,
                    y : innerSum/totalSum*100,
                    drilldown: "Quarter "+(quarter++)
                };
            
            result.push(temp);
            innerSum = 0;
        }

        console.log(JSON.stringify(result))
        $('#container3').highcharts({
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Quarterly Sales in USD for 2015'
        },
        subtitle: {
            text: 'Click the slices to view versions.'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.y:.1f}%'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: result
        }],
        drilldown: {
            series: [{
                name: 'Quarter 1',
                id: 'Quarter 1',
                data: drillArray.splice(0,3)
            }, {
                name: 'Quarter 2',
                id: 'Quarter 2',
                data: drillArray.splice(0,3)
            }, {
                name: 'Quarter 3',
                id: 'Quarter 3',
                data: drillArray.splice(0,3)
            }, {
                name: 'Quarter 4',
                id: 'Quarter 4',
                data: drillArray.splice(0,3)
            }]
        }
    });
    });
    
});