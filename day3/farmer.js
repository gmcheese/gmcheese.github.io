// Adds the svg canvas
var dataset;
var w = 700;
var h = 500;
var barPadding = 1;
var padding = 40;

var svg = d3.select("#graph1")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g");

var parseTime = d3.timeParse("%b");
var formatTime = d3.timeFormat("%b");

//Function for converting CSV values from strings to Dates and numbers
var rowConverter = function (d) {
    return {
        Index: parseInt(d.Index),
        Month: parseTime(d.Month),
        Count: parseInt(d.Count)
    };
}

var names = ["Fresh fruit", "Stored fruit", "Stored vegetables", "Fresh vegetables"];
var colors = ["black", "red", "yellow", "blue"];
//Add legend
svg.selectAll("text")
    .data(names)
    .enter()
    .append("text")
    .text(function (d, i) {
        console.log(d[i]);

        return d;
    })
    .attr("text-anchor", "left")
    .attr("x", w - padding * 3)
    .attr("y", function (d, i) {
        return (padding + i * 10);
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "black");

//Add squares to legend
svg.selectAll("circle")
    .data(colors)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
        return w-padding*3.2;
    })
    .attr("cy", function (d,i) {
        return padding+i*10-5.5+2;
    })
    .attr("r", function (d) {
        return 4;
    })
    .attr("fill", function(d){return d});

// load data
d3.csv("farmer.csv", rowConverter, function (data) {
    dataset = data;

    var startDate = d3.min(dataset, function (d) { return d.Month; });
    var endDate = d3.max(dataset, function (d) { return d.Month; });

    var fruitsHarvest = dataset.filter(function (d) {
        return (d.Index == 0)
    })
    var fruitsStorage = dataset.filter(function (d) {
        return (d.Index == 1)
    })
    var vegetablesStorage = dataset.filter(function (d) {
        return (d.Index == 2)
    })
    var vegetablesHarvest = dataset.filter(function (d) {
        return (d.Index == 3)
    })
    //Create scale functions
    xScale = d3.scaleTime()
        .domain([
            d3.timeDay.offset(startDate, -1),  //startDate minus one day, for padding
            d3.timeDay.offset(endDate, 1)	  //endDate plus one day, for padding
        ])
        .range([padding, w - padding]);

    yScale = d3.scaleLinear()
        .domain([
            0,  //Because I want a zero baseline
            50
        ])
        .range([h - padding, padding]);

    //Define rect bandwidth
    var bandwidthScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .rangeRound([0, w])
        .paddingInner(0.05);

    //Define X axis
    xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(9)
        .tickFormat(formatTime);

    //Define Y axis
    yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(10);

    //Create X axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    //Create Y axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    var heightRect = [];

    svg.selectAll("rect1")
        .data(fruitsHarvest)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return xScale(d.Month);
        })
        .attr("y", function (d) {
            console.log(yScale(d.Count));

            return (yScale(d.Count));
        })
        .attr("height", function (d) {
            var height = yScale(0) - yScale(d.Count);
            heightRect.push(height);
            return (height);
        })
        .attr("width", bandwidthScale.bandwidth())
        .attr("fill", "black");

    svg.selectAll("rect2")
        .data(fruitsStorage)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return xScale(d.Month);
        })
        .attr("y", function (d, i) {
            return (yScale(d.Count) - heightRect[i]);
        })
        .attr("height", function (d, i) {
            var height = yScale(0) - yScale(d.Count);
            heightRect[i] += height;
            return (height);
        })
        .attr("width", bandwidthScale.bandwidth())
        .attr("fill", "red");

    svg.selectAll("rect3")
        .data(vegetablesStorage)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return xScale(d.Month);
        })
        .attr("y", function (d, i) {
            return (yScale(d.Count) - heightRect[i]);
        })
        .attr("height", function (d, i) {
            var height = yScale(0) - yScale(d.Count);
            heightRect[i] += height;
            return (height);
        })
        .attr("width", bandwidthScale.bandwidth())
        .attr("fill", "yellow");

    svg.selectAll("rect4")
        .data(vegetablesHarvest)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return xScale(d.Month);
        })
        .attr("y", function (d, i) {
            return (yScale(d.Count) - heightRect[i]);
        })
        .attr("height", function (d, i) {
            var height = yScale(0) - yScale(d.Count);
            heightRect[i] += height;
            return (height);
        })
        .attr("width", bandwidthScale.bandwidth())
        .attr("fill", "blue");
});
