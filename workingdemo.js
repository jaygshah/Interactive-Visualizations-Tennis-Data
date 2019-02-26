//////////////////////////////////////////////////////////
////////////////////////////////////////////////////////// 
///////////////    Author: Jay Shah    ///////////////////
/////////////// Email: jgshah1@asu.edu ///////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

var data = [];
var width = 1100;
var height = 700;

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);});};

function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none')}

function reset(d){  
            var data = [
                            [
                            {axis: "1st Serve %", value: 0},
                            {axis: "1st Serve Points Won", value: 0},
                            {axis: "2nd Serve Points Won", value: 0},
                            {axis: "Break Points conversion rate", value: 0},
                            {axis: "Receiving Points Won", value: 0},
                            {axis: "Winner Points", value: 0}
                            ]
                        ];
            RadarChart.draw("#chart", data);}

function row(d) {
    if (d.player1=="Rafael Nadal" || d.player1=="Roger Federer" || d.player1=="Andy Murray" || d.player1=="Novak Djokovic" || d.player1=="Stanislas Wawrinka" || d.player1=="Andy Roddick")
  return {
    year: +d.year, 
    ace1: +d.ace1,
    player1: d.player1,
    double1: +d.double1,
    error1: +d.error1,
    fastServe1: +d.fastServe1,
    firstServe1: +d.firstServe1,
    net1: +d.net1,
    avgFirstServe1: +d.avgFirstServe1,
    avgSecServe1: +d.avgSecServe1,
    firstPointWon1: +d.firstPointWon1,
    secPointWon1: +d.secPointWon1,
    winner1: +d.winner1,
    player2: d.player2,
    ace2: +d.ace2,
    firstServe2: +d.firstServe2,
    net2: +d.net2,
    firstPointWon2: +d.firstPointWon2,
    winner2: +d.winner2,
    break1: +d.break1,
    return1: +d.return1};}

d3.csv("formateddata.csv", row, function(error, csv_data){
    csv_data.forEach(function (d) {
        data.push({ firstServe2: d.firstServe2, ace2: d.ace2, 
            winner2: d.winner2, firstPointWon2: d.firstPointWon2, net2: d.net2, winner1: d.winner1, 
            firstPointWon1: d.firstPointWon1, net1: d.net1, year: d.year, ace1: d.ace1, player1: d.player1, 
            double1: d.double1,error1: d.error1, fastServe1:d.fastServe1, player2: d.player2, 
            firstServe1: d.firstServe1, avgFirstServe1: d.avgFirstServe1, avgSecServe1: d.avgSecServe1, secPointWon1: d.secPointWon1, break1: d.break1, return1: d.return1 });});

    var tooltip = d3.select("body").append("div")   
                .attr("class", "tooltip")               
                .style("opacity", 0);

    var scale_y = d3.scale.linear()
                    .domain([
                            d3.max(data, function(d) { return d.double1; })+1,
                            d3.min(data, function(d) { return d.double1; })-0.4
                            ])
                    .range([0, 570]);
                                
    var scale_x = d3.scale.linear()
                    .domain([
                            d3.min(data, function(d) { return d.error1; }),
                            d3.max(data, function(d) { return d.error1; })+10
                            ])
                    .range([0, 1100]);
    
    var data_svg = d3.select(".scatterdiv")
                    .append("svg")
                    .attr("class","scatter")
                    .attr("width", width)
                    .attr("height", height)

    var clickbutton = d3.select(".buttondiv")
                    .attr("class","buttondiv")
                    .attr("transform", "translate(100,600)")

    var xAxis = d3.svg.axis()
                .scale(scale_x)
                .innerTickSize(1)
                .outerTickSize(1)
                .orient("bottom");

    var yAxis = d3.svg.axis()
                .scale(scale_y)
                .innerTickSize(1)
                .outerTickSize(1)
                .orient("left");

    data_svg.append("svg:g")   
            .attr("class", "axis x")
            .attr("transform", "translate(20,600)")
            .style("font-size","20px")
            .call(xAxis)
            .style("font-family", "Gill Sans");

    data_svg.append("svg:g")
            .attr("class", "axis y")
            .attr("transform", "translate (" + 20 + " 30)")
            .style("font-size","20px")
            .call(yAxis)
            .style("font-family", "Gill Sans");

    data_svg.append("text")      
            .attr("transform", "translate(500,670)")
            .style("text-anchor", "middle")
            .text("Errors vs Double Faults")
            .style("font-size","35px")
            .style("font-family", "Gill Sans");                                       

    var default_opacity = 0.5;
    var colorScale = d3.scale.category10(); 
    var radiusScale = d3.scale.linear().domain([
                            d3.min(data, function(d) { return d.error1 + d.double1; }),
                            d3.max(data, function(d) { return d.error1 + d.double1; })
                            ]).range([1, 10]);

    function color(d) {
            return d.player1;}

    function radius(d) {
        return d.error1*2 + d.double1*10;}

    function order(a, b) {
        return radius(b) - radius(a);}

    var data_g = data_svg.selectAll("circle")
        .data(data)
        .enter()
        .append("g");

    var data_radar = [
                        [
                        {axis: "1st Serve %", value: 0},
                        // {axis: "Average First Serve", value: 0},
                        // {axis: "Average Second Serve", value: 0},
                        {axis: "1st Serve Points Won", value: 0},
                        {axis: "2nd Serve Points Won", value: 0},
                        {axis: "Break Points conversion rate", value: 0},
                        {axis: "Receiving Points Won", value: 0},
                        {axis: " Points", value: 0}
                        ]
                    ];

    RadarChart.draw("#chart", data_radar);

    var data_circles = data_g.append("circle")
        .attr("cx", function(d) {
            return scale_x(d.error1);})
        .attr("opacity", default_opacity)
        .attr("cy", function(d) {
            return scale_y(d.double1);})
        .attr("r", function(d) {
            return radiusScale(radius(d));})
        .style("fill", function (d) {
            return colorScale(color(d));})
        .style("stroke", "black")
        .attr('class',function(d){
            return d.player1.replace(' ','_');})
        .on("mouseover", function(d) {
            d3.selectAll("." +d.player1.replace(' ','_'))
                .moveToFront()
                .transition().duration(1000)
                .style("opacity", 2);
            d3.selectAll("circle:not(." +d.player1.replace(' ','_') +")")
                .transition().duration(1500)
                .style("opacity", 0.02);
            tooltip.transition()        
                .duration(2000)      
                .style("opacity", 0.9);      
            tooltip.html("<b>" +d.player1 + "</b> vs <b>" +d.player2 +"</b> (" +d.year +")<br><b>Double Faults</b>: " + d.double1 +" and <b>Errors</b>: " +d.error1)  
                .style("left", (d3.event.pageX + (radius(d)/2)*0.1) + "px")     
                .style("top", (d3.event.pageY + (radius(d)/2)*0.1) + "px");

            document.getElementById('chart').style.display = "block";
            console.log(d.winner2);
            var data = [
                            [
                            {axis: "1st Serve %", value: d.firstServe1},
                            // {axis: "Average First Serve", value: d.avgFirstServe1},
                            // {axis: "Average Second Serve", value: d.avgSecServe1},
                            {axis: "1st Serve Points Won", value: d.firstPointWon1},
                            {axis: "2nd Serve Points Won", value: d.secPointWon1},
                            {axis: "Break Points conversion rate", value: d.break1},
                            {axis: "Receiving Points Won", value: d.return1},  
                            {axis: "Winner Points", value: d.winner1}                        
                            ]
                        ];
            RadarChart.draw("#chart", data);})
        .on("mouseout", function(d) {
            document.getElementById('chart').style.display = "hidden";
            d3.selectAll("circle")
                .transition().duration(1000)
                .style("opacity", default_opacity);
            tooltip.transition()        
                .duration(2000)      
                .style("opacity", 0);})
        .sort(order);

    var legend = data_svg.selectAll("svg")
    .data(colorScale.domain())
    .enter().append("g")
    .attr("class","legend")
    .attr("transform", "translate(200,0)")
    .attr("transform", function(d,i) {
        return "translate(" +(i+1)*5 +",0)";});

    legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("transform", function(d,i) {
        return "translate(" +(i*(160+i)) +",0)";})
    .style("fill", colorScale);
    
    legend.append("text")
    .data(colorScale.domain())
    .attr("id", function(d){return "text_"+d.replace(" ","_");})
    .attr("transform", function(d,i) {
        return "translate(" +(i*(160+i)+25) +",16)";})
    .text(function(d) { 
        return d;})
    .on("click", function(d) {
        var appBanners = document.getElementsByClassName(d.replace(' ','_'));
        for (var i = 0; i < appBanners.length; i ++) {      
            if (!isHidden(appBanners[i])) {
                appBanners[i].style.display = 'none';
                d3.select(this).attr("fill","#E8E7E7");
            }
            else {
                appBanners[i].style.display = 'block';
                d3.select(this).attr("fill","black");
                document.getElementById("text_" +d.replace(" ","_")).style.color = "black";}}})
    .style("text-anchor", "start")
    .style("font-size","20px")
    .style("font-family","Gill Sans");});