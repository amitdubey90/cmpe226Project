!function() {
    var width = 200,
        height = 200,
        radius = Math.min(width, height) / 2;

    var dColor,
        dPercent,
        dName;

    var stokeColor = "#ffffff",
        stokeWidth = 2,
        stokeLinecap = "round",
        opacityDefault = 0;
    
    var color = d3.scale.ordinal()
            .range(function(d) {
                return d.color;
            });

    var arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(radius - 10)
            .innerRadius(radius - 40);

    var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) {
                return d.percent;
            });

    var svg = d3.select(".pie-1").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var text = svg.append("g")
            .attr("class", "pie-text")
            .attr("transform", function(d) {
                console.log(arc.centroid.radius);
                //return "translate(" + arc.centroid(d) + ")";
            });

    text.append("text")
        .attr("class", "pie-name")
        .attr("text-anchor", "middle");

    text.append("text")
        .attr("class", "pie-percent")
        .attr("text-anchor", "middle");

    d3.csv("data.csv", function(error, data) {
        data.forEach(function(d) {
            dColor = d.color;
            dPercent = +d.percent;
            dName = d.name;
            return dColor, dPercent, dName;
        });

        var g = svg.selectAll(".arc")
                .data(pie(data))
                .enter()
                .append("g")
                .attr("class", "arc");

        console.log(data[0].percent);
        console.log(data[0].name);

        svg.select(".pie-name")
            .text(data[0].name);

        svg.select(".pie-percent")
            .text(data[0].percent);

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) {
                return d.data.color;
            })
            .style("fill-opacity", function(d) {
                return opacityDefault;
            })
            .style("stroke", function(d) {
                return stokeColor;
            })
            .style("stroke-width", function(d){
                return stokeWidth;
            })
            .style("stroke-linecap", function(d) {
                return stokeLinecap;
            })
            .style("stroke-opacity", function(d) {
                return opacityDefault;
            })
            .transition().delay(function(d, i) {
                return i * 0;
            }).duration(600)
            .attrTween('d', function(d) {
                
                var i = d3.interpolate(d.startAngle+0, d.endAngle);
                var item = this;

                return function(t) {
                    item.style.fillOpacity = t;
                    item.style.strokeOpacity = t;
                    d.endAngle = i(t);
                    return arc(d);
                };
            });
    });

    function arcTween(a) {
        console.log(this);
        var i = d3.interpolate(this._current, a);
        this._current = i(0);

        return function(t) {
            return arc(i(t));
        };
    };
}();