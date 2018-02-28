// Adds the svg canvas
var dataset;
var w = 700;
var h = 500;
var barPadding = 1;
var padding = 30;
var legendRectSize = 20;
var legendSpacing = 4;


var svg = d3.select("#graph1")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g");


var dataset;
var labels = ["a", "b", "c", "d", "e", "f"];

var outerRadius = w / 2;
var innerRadius = w / 3;
var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);


//Easy colors accessible via a 10-step ordinal scale
var color = d3.scaleOrdinal(d3.schemeCategory10);

//Set up stack method
var stack = d3.stack()
    .order(d3.stackOrderDescending);  // <-- Flipped stacking order

var parseTime = d3.timeParse("%m");
//For converting Dates to strings
var formatTime = d3.timeFormat("%b");
var rowConverter = function (d) {
    return {
        CrimeType: d.CrimeType,
        Count: parseInt(d.Count)
    };
}

//Function for converting CSV values from strings to Dates and numbers
//We assume one column named 'Date' plus several others that will be converted to ints 
var rowConverter = function (d, i, cols) {

    //Initial 'row' object includes only date
    var row = {
        month: parseTime(d.mon),  //Make a new Date object for each year + month
    };

    //Loop once for each vehicle type
    for (var i = 1; i < cols.length; i++) {
        var col = cols[i];

        //If the value exists…
        if (d[cols[i]]) {
            row[cols[i]] = +d[cols[i]];  //Convert from string to int
        } else {  //Otherwise…
            row[cols[i]] = 0;  //Set to zero
        }
    }

    return row;
}

// load data
d3.csv("offenseMonth.csv", rowConverter, function (data) {
    console.log("loading csv");
    dataset = data;
    console.log(dataset);

    //Now that we know the column names in the data…
    var keys = dataset.columns;
    keys.shift();  //Remove first column name ('Date')
    stack.keys(keys);  //Stack using what's left (the car names)

    //Data, stacked
    var series = stack(dataset);
    // console.log(series);
    //Create scale functions
    xScale = d3.scaleTime()
        .domain([
            d3.min(dataset, function (d) { return d.month; }),
            d3.max(dataset, function (d) { return d.month; })
        ])
        .range([padding, w - padding * 2]);

    yScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(dataset, function (d) {
                var sum = 0;

                //Loops once for each row, to calculate
                //the total (sum) of sales of all vehicles
                for (var i = 0; i < keys.length; i++) {
                    sum += d[keys[i]];
                };

                return sum;
            })
        ])
        .range([h - padding, padding / 2])
        .nice();

    //Define axes
    xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(10)
        .tickFormat(formatTime);

    //Define Y axis
    yAxis = d3.axisRight()
        .scale(yScale)
        .ticks(5);

    //Define area generator
    area = d3.area()
        .x(function (d) { return xScale(d.data.month); })
        .y0(function (d) { return yScale(d[0]); })
        .y1(function (d) { return yScale(d[1]); });

    //Create areas
    svg.selectAll("path")
        .data(series)
        .enter()
        .append("path")
        .attr("class", "area")
        .attr("d", area)
        .attr("fill", function (d, i) {
            return d3.schemeCategory20[i];
        })
        .append("title")  //Make tooltip
        .text(function (d) {
            return d.key;
        });


    //Create axes
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (w - padding * 2) + ",0)")
        .call(yAxis);
    
    console.log(keys);
    
    var legend = svg.selectAll('.legend')
        .data(keys)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = height * color.domain().length / 2;
            var horz = offset + legendRectSize * 1.5;
            var vert = i * height + offset * 1.5;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function (d, i) {
            return (color(i))
        })
        .style('stroke', function (d, i) {
            return (color(i))
        });

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d, i) {
            return d;
        });
})