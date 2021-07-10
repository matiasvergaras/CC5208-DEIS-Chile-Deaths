// Fuente: http://bl.ocks.org/williaster/af5b855651ffe29bdca1
const makeVis = function(data) {
    // Common pattern for defining vis size and margins
    const margin = { top: 40, right: 120, bottom: 80, left: 70 },
    width  = 860 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // Add the visualization svg canvas to the vis-container <div>
    const canvas = d3.select("#V1").append("svg")
    .attr("width",  width  + margin.left + margin.right)
    .attr("height", height + margin.top  + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const sizeScale = d3.scaleLinear()
        .domain([0, 400000])
        .range([1, 1]);
    //change last line by this to add sizescaling
    //  .range([1, 2]);


    // to use regions instead of poblation
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const xScale = d3.scaleLinear()
    .domain([ 50,
    d3.max(data, function(d) { return d.Porcentaje_60; }) + 1 ])
    .range([0, width]);

    const yScale = d3.scaleLinear()
    .domain([ d3.min(data, function(d) { return d.Prom_Proy_Poblacion; }) - 1,
    d3.max(data, function(d) { return d.Prom_Proy_Poblacion; }) + 20000 ])
    .range([height, 0]); // flip order because y-axis origin is upper LEFT

    // Define our axes
    const xAxis = d3.axisBottom(xScale)

    const yAxis = d3.axisLeft(yScale)

    const xAxis2 = d3.axisBottom(xScale)

    const yAxis2 = d3.axisLeft(yScale)


    // Add x-axis to the canvas
    canvas.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")") // move axis to the bottom of the canvas
    .call(xAxis);


    canvas.append("text")
        .attr("transform",
            "translate(" + (width/2) + " ," +
            (height + margin.top) + ")")
        .style("text-anchor", "middle")
        .text("% Muertes sobre 60 años con respecto al total de muertes");

    // Add y-axis to the canvas
    canvas.append("g")
    .attr("class", "y axis") // .orient('left') took care of axis positioning for us
    .call(yAxis);

    canvas.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Promedio proyección población 2016-2020");


    // Adding a title
    canvas.append("text")
        .attr("x", (width / 2))
        .attr("y", -18)
        .attr("text-anchor", "middle")
        .style('font-weight','bold')
        .style("font-size", "16px")
        //.style("text-decoration", "underline")
        .text("Porcentaje de defunciones sobre 60 años c/r a total de defunciones por Comuna");
    canvas.append("text")
        .attr("x", (width / 2))
        .attr("y", -3)
        .attr("text-anchor", "middle")
        .style('font-weight','bold')
        .style("font-size", "16px")
        //.style("text-decoration", "underline")
        .text("v/s Promedio Proyección de Población 2016-2020");


    // Add the tooltip container to the vis container
    // it's invisible and its position/contents are defined during mouseover
    const tooltip = d3.select("#V1").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    // tooltip mouseover event handler
    const tipMouseover = function (d) {
        const color = colorScale(d.Region);
        const html = d.Comuna + "<br/>" +
            "</b> Región:<b/><span style='color:" + color +"'>" +d.Region+ "</span> <br/>" +
            "</b> Total muertes:<b/>" +d.Muertes_Total+ "<br/> " + "</b> Muertes sobre 60:<b/>"
            +d.Muertes_60+ "</b><br/>Porcentaje:<b/>" + Math.round(d.Porcentaje_60 *100)/100;

        tooltip.html(html)
            .style("left", (d3.event.pageX + 15) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .transition()
            .duration(200) // ms
            .style("opacity", .9) // started as 0!

    };
    // tooltip mouseout event handler
    const tipMouseout = function(d) {
    tooltip.transition()
    .duration(300) // ms
    .style("opacity", 0); // don't care about position!
};
    var shape = d3.scaleOrdinal(d3.symbols);

    // Add data points

    canvas.selectAll(".dot")
    .data(data)
    .enter().append("path")
        .attr('d', d3.symbol().type( function(d) {return shape(d.Region)}))
        .attr("transform", function(d) {return "translate(" + xScale(d.Porcentaje_60) + ',' + yScale (d.Prom_Proy_Poblacion) + "), scale(" + sizeScale(d.Prom_Proy_Poblacion)+")"})
         .attr("class", "dot")
        .on("mouseover", tipMouseover)
        .on("mouseout", tipMouseout)
        .style("stroke", function(d) { return colorScale( d.Region ); })
        .style("fill", function(d) { return "rgba(255, 255, 255, 0)"; })
        .on("mouseover", tipMouseover)
        .on("mouseout", tipMouseout)
        .style("opacity","0");

    canvas.selectAll(".dot")
        .transition().duration(400)
        .delay(function(d,i){ return 150 + 10 * i; })
        .style("opacity","1");


    //Legend
    var legend = canvas.selectAll(".legend")
        .data([... new Set(data.map(function (d) {return d.Region;}))])
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d,i) { return "translate(120," + ((i*20)+17)  + ")"; })
        .style("opacity","0");

    legend.append("path")
        .attr('d', d3.symbol().type( function(d) {return shape(d)}))
        .attr("x", width - 21)
        .style("stroke", function(d) { return colorScale( d ); })
        .style("fill", function(d) { return "rgba(255, 255, 255, 0)"; })
        .attr("transform", function(d) {return "translate(" + (width - 100) + ", " + 10 +  ")"})


    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {switch (d) {
            case "Aysen del gen. Carlos Ibáñez del Campo":
                return "Aysén";
            case "Libertador General Bernardo O'Higgins":
                return "O'Higgins";
            case "Arica y Parinacota":
                return "Arica y P.";
            case "La Araucanía":
                return "Araucanía";
            default:
                return d;
        } });

    legend.transition().duration(500).delay(function(d,i){ return 600 + 100 * i; }).style("opacity","1");

    function makeGrid() {
        canvas.insert("g", '#scatterplot')
            .attr("class", "grid grid-x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis2
                .tickSize(-height)
                .tickFormat(''));

        canvas.insert("g", '#scatterplot')
            .attr("class", "grid grid-y")
            .call(yAxis2
                .tickSize(-width)
                .tickFormat(''));

        canvas.selectAll('.grid')
            .selectAll('line')
            .attr('stroke', 'lightgray');
    }
    makeGrid()

};


function filterData(regiones, data){
    return data.filter(function(d) {return regiones.includes(d.Region);})
}

function loadData(regiones){
    d3.csv('vis1/vis1.csv', function loadCallback(error, data) {
        data.forEach(function(d) { // convert strings to numbers
            d.Region = d.Region;
            d.Prom_Proy_Poblacion = +d.Prom_Proy_Poblacion;
            d.Comuna = d.Comuna;
            d.Porcentaje_60 = +d.Porcentaje_60;
        });
        data = filterData(regiones, data)
        document.getElementById('V1').innerHTML='';
        makeVis(data);
    });
}


window.addEventListener('load', function () {
    var regiones = ['Antofagasta'];
    loadData(regiones)
    var cbs = document.forms['regiones-V1'].elements['region'];
    for(var i=0, cbLen=cbs.length; i<cbLen;i++){
        cbs[i].addEventListener('change', function() {
            if (this.checked) {
                regiones.push(this.value);
                loadData(regiones.reverse())
            } else {
                let index = regiones.indexOf(this.value);
                regiones.splice(index, 1);
                loadData(regiones.reverse());
            }
        });
    }
})

