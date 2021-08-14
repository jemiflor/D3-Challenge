//app.js
//Jemiflor

d3.csv("assets/data/data.csv")
    .then(function(data) {
        
        //cast poverty and healthcare to numbers
        data.forEach(acs => {
            acs.poverty = +acs.poverty;
            acs.healthcare = +acs.healthcare
        });

        drawScatterPlot(data)

    });

function drawScatterPlot(acs){

    //Add responsive SVG container to the plot container
    //Reference: https://stackoverflow.com/questions/43868155/d3-y-axis-scale-not-visible?answertab=active#tab-top
    //***************************************************************/
    
    var width = 700;
    var height = 370;

    var getRatio = (d) => `${(margin[d]/width * 100)}%`;

    var margin = {
        top: 10, left: 60, bottom: 50, right: 150
    }

    var marginRatio = {
        top: getRatio("top"), 
        left: getRatio("left"), 
        bottom: getRatio("bottom"), 
        right: getRatio("right")
    }
    
    var svg = d3.select("div#scatter-plot")
                .append("div")
                ////container class to make it responsive
                .classed("svg-container", true)
                .attr("style","padding-bottom: " + Math.ceil(height * 100 / width) + "%") 
                .append("svg")
                //responsive SVG needs these 2 attributes and no width and height attr
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
                //class to make it responsive
                .classed("svg-content-responsive", true)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //***************************************************************/

    //Add xAxis to the SVG       
    var xAxisScale = d3.scaleLinear().range([0, width])         
    var xAxis = xAxisScale.domain([d3.min(acs,  e => e.poverty)-2, 
                                    d3.max(acs,  e => e.poverty) + 3]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xAxis));                  

    //Add yAxis to the SVG                
    var yAxisScale = d3.scaleLinear().range([height, 0]);
    var yAxis = yAxisScale.domain([d3.min(acs,  e => e.healthcare)-3, 
                                    d3.max(acs,  e => e.healthcare) + 3]);
    svg.append("g")
        .call(d3.axisLeft(yAxis));    
    
    //Add data points - Circles        
    svg.append('g')
    .selectAll("circle")
    .data(acs)
    .enter()
    .append("circle")
        .attr("cx", p => xAxisScale(p.poverty))
        .attr("cy", hc => yAxisScale(hc.healthcare))
        .attr("r", "14")
        .attr("stroke", "white")  
        .attr("stroke-opacity", 0.8)      
        .style("fill", "#FF69B4"); 

    //Add yAxis labels       
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", (0-height)/2)
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Lacks Healthcare (%)");

    //Add xAxis labels        
    svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom -5})`)
        .attr("class", "aText")
        .text("In Poverty (%)");        

    //Add state abbreviation to data points - Circles
    svg.append("text")
        //.attr("class", "aText")
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .style("fill", "brown")
        .selectAll("tspan")
        .data(acs)
        .enter()
        .append("tspan")
        .attr("x", p => xAxisScale(p.poverty - 0.02))
        .attr("y", hc => yAxisScale(hc.healthcare - 0.4))
        .text(e => e.abbr);             
}