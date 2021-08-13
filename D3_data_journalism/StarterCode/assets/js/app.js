//app.js
//Jemiflor

d3.csv("assets/data/data.csv")
    .then(function(data) {
        
        let poverty = [];
        let healthCare = [];

        data.forEach(acs => {
            poverty.push(+acs.poverty);
            healthCare.push(+acs.healthcare);
        });
        drawScatterPlot(poverty, healthCare)

    });

function drawScatterPlot(poverty, healthCare){
   
    console.log(d3.max(poverty,  data => data));
    console.log(d3.max(healthCare,  data => data));

    //Add responsive SVG container to the plot container
    var svg = d3.select("div#scatter-plot")
                .append("div")
                ////container class to make it responsive
                .classed("svg-container", true) 
                .append("svg")
                //responsive SVG needs these 2 attributes and no width and height attr
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 600 400")
                //class to make it responsive
                .classed("svg-content-responsive", true);

    //Add xAxis to the SVG       
    var xAxisScale = d3.scaleLinear().range([0, 600])         
    var xAxis = xAxisScale.domain([d3.min(poverty,  data => data)-2, 
                                    d3.max(poverty,  data => data) + 3]);
    svg.append("g")
        .attr("transform", "translate(0, 380)")
        .call(d3.axisBottom(xAxis));                  

    //Add yAxis to the SVG                
    var yAxisScale = d3.scaleLinear().range([400, 0]);
    var yAxis = yAxisScale.domain([d3.min(healthCare,  data => data)-3, 
                                    d3.max(healthCare,  data => data) + 3]);
    svg.append("g")
        .call(d3.axisLeft(yAxis));    
        
    svg.append('g')
    .selectAll("circle")
    .data(poverty)
    .enter()
    .append("circle")
        .attr("cx", p => xAxisScale(p) )
        .attr("cy", (hc, i) => yAxisScale(healthCare[i]))
        .attr("r", "10")
        .attr("stroke", "white")
        .style("fill", "#FF69B4");   /*FF69B4  FF00FF FF7F50*/
}