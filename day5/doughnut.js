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

//Width and height
var w = 300;
var h = 300;

var dataset;
var labels = ["a", "b", "c", "d", "e", "f"];

var outerRadius = w / 2;
var innerRadius = w / 3;
var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);


//Easy colors accessible via a 10-step ordinal scale
var color = d3.scaleOrdinal(d3.schemeCategory10);
var pie = d3.pie()
    .sort(null)
    .value(function (d) { return d.CrimeFraction });
var rowConverter = function (d) {
    return {
        Borough: d.Borough,
        CrimeFraction: parseFloat(d.CrimeFraction)
    };
}

// load data
d3.csv("crimeBorough.csv", rowConverter, function (data) {
    console.log("loading csv");
    dataset = data;
    console.log(dataset);


    //Set up groups
    var arcs = svg.selectAll("g.arc")
        .data(pie(dataset))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

    //Draw arc paths
    arcs.append("path")
        .attr("fill", function (d, i) {
            return color(i);
        })
        .attr("d", arc);

    //Labels
    arcs.append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .text(function (d) {        
            return (d.data.CrimeFraction.toFixed(3)*100+'%');
        });

    var legend = svg.selectAll('.legend')
        .data(dataset)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = height * color.domain().length / 2;
            var horz = offset + legendRectSize * 1.5;
            var vert = i * height + offset*1.5;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function(d,i){
            return(color(i))})
        .style('stroke', function(d,i){
            return(color(i))});

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d, i) {    
            return d.Borough; });
})