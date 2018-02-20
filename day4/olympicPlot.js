// Adds the svg canvas
var dataset;
var w = 700;
var h = 500;
var barPadding = 1;
var padding = 70;

var svg = d3.select("#graph1")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g");

var parseTime = d3.timeParse("%Y");
var parseTimeHour = d3.timeParse("%H.%M.%S");
var formatTime = d3.timeFormat("%Y");
var formatTimeHour = d3.timeFormat("%H")

//Function for converting CSV values from strings to Dates and numbers
var rowConverter = function (d) {
    return {
        Year: parseTime(d.Year),
        Athlete: d.Athlete,
        Country: d.Country,
        Time: parseTimeHour(d.Time),
        Sex: d.Sex
    };
}

var names = ["Fresh fruit", "Stored fruit", "Stored vegetables", "Fresh vegetables"];
var colors = ["black", "red", "yellow", "blue"];

var key = function (d) {
    return d.key;
};

// load data
d3.csv("olympic_merged.csv", rowConverter, function (data) {
    console.log("loading csv");
    dataset = data;
    console.log(dataset);
    var startDate = d3.min(dataset, function (d) { return d.Year; });
    var endDate = d3.max(dataset, function (d) { return d.Year; });

    olympic_male = dataset.filter(function (d) {
        return (d.Sex == "m")
    })
    olympic_female = dataset.filter(function (d) {
        return (d.Sex == "f")
    })
    console.log(olympic_male);
    
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
            d3.max(dataset, function (d) {
                return d.Time;
            })
        ])
        .range([h - padding, padding]);

    //Define X axis
    xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(9)
        .tickFormat(formatTime);

    //Define Y axis
    yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(10)
        .tickFormat(formatTimeHour);

    //Create X axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    //Create Y axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

});
