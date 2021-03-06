//Width and height
var w = 500;
var h = 300;
var padding = 30;

var svg = d3.select("#graph1")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g");


var dataset = [];
var numDataPoints = 50;
var xRange = Math.random() * 1000;
var yRange = Math.random() * 1000;
var generateData = function functionUpdateDataset() {
    dataset = [];
    for (var i = 0; i < numDataPoints; i++) {
        var newNumber1 = Math.floor(Math.random() * xRange);
        var newNumber2 = Math.floor(Math.random() * yRange);
        dataset.push([newNumber1, newNumber2]);
    }
}
generateData();

//Create scale functions
var xScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function (d) { return d[0]; })])
    .range([padding, w - padding * 2]);

var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function (d) { return d[1]; })])
    .range([h - padding, padding]);

var aScale = d3.scaleSqrt()
    .domain([0, d3.max(dataset, function (d) { return d[1]; })])
    .range([0, 10]);

//Define X axis
var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(5);

var yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(5);

//Create SVG element

//Create circles
svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
        return xScale(d[0]);
    })
    .attr("cy", function (d) {
        return yScale(d[1]);
    })
    .attr("r", function (d) {
        return aScale(d[1]);
    });

//Create X axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);
d3.select("p")
    .on("click", function () {
        generateData();

        //Update scale domains
        xScale.domain([0, d3.max(dataset, function (d) { return d[0]; })]);
        yScale.domain([0, d3.max(dataset, function (d) { return d[1]; })]);

        svg.selectAll("circle")
            .data(dataset)
            .transition()
            .duration(1000)
            .on("start", function () {
                d3.select(this)
                    .attr("fill", "magenta");
            })
            .attr("cx", function (d) {
                return xScale(d[0]);
            })
            .attr("cy", function (d) {
                return yScale(d[1]);
            })
            .on("end", function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill", "black");
            })
    });
