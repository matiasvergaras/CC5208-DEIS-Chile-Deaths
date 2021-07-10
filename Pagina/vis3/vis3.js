export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["formated-data per month.csv",new URL("./formated-data per month.csv",import.meta.url)],["formated-data-men.csv",new URL("./formated-data-men.csv",import.meta.url)],["formated-data-women.csv",new URL("./formated-data-women.csv",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("taitol")).define(["md"], function(md){return(
md`# Evolucion enfermedades respiratorias por mes según grupo etario`
)});
  main.variable(observer("viewof selD")).define("viewof selD", ["Inputs","dataSel"], function(Inputs,dataSel){return(
Inputs.select(dataSel, {label: "selector", format: x => x[0], value: dataSel.find(x => x[0] === "general")})
)});
  main.variable(observer("selD")).define("selD", ["Generators", "viewof selD"], (G, _) => G.input(_));
  main.variable(observer("matrix")).define("matrix", ["d3","DOM","width","height","x","y","selD","categories","color","xAxis","yAxis"], function(d3,DOM,width,height,x,y,selD,categories,color,xAxis,yAxis)
{
  const svg = d3.select(DOM.svg(width, height))
    .style("width", "100%")
    .style("height", "auto")
    .style("font", "1rem verdana");
  
  const make_class = (item) => item.toLowerCase().split(' ').join('_').split('-').join('')
  const make_id = d => `coords_${Math.floor(x(d.xval))}_${Math.floor(y(d.yval))}`
  
  const tooltip = d3.select("body").append("div")
    .style("position","absolute")
    .style("display","block")
    .style("background","gray")
    .style("min-width","10px")
    .style("max-width","440px")
    .style("border","1px solid white")
    .style("border-radius","4px") 
    .style("padding","4px 8px")
    .style("height", "auto")
    .style("opacity" , "0")
  
  
  
  const rects = svg.append("g")
    .selectAll("g")
    .data(selD[1])
    .enter().append("g")
    .attr("class", (d, i) => `${i} bar`)
    .selectAll("g")
    .data(d => categories.map(e => {return {'xval' : d.index, 'yval' : e, 'count': d[e]}}))
    .enter().append("g")
    .attr("class", (d, i) => `${i} tile`)
    .on("mousemove" , function (d) {
      tooltip.transition().style("opacity", 1)
      
      tooltip
        .style("left" , (d3.event.pageX+"px"))
        .style("top" , (d3.event.pageY+"px"))
        .html(`mes: ${d.yval}<br>grupo etario: ${d.xval} años<br>muertes: ${d.count}`);
      
      d3.select(this)
        .transition()
        .attr("stroke" , "white")
        .attr("stroke-width", 3)

      d3.select(this)
        .style("cursor" , "crosshair")
    })
    .on("mouseout" , function (d) {
      tooltip.transition().style("opacity", 0)
      d3.select(this)
        .transition()
        .attr('stroke', '#fff')
        .attr('stroke-width', 0)
      d3.select(this)
        .style("cursor", "default")
    })
    
  
  rects.append("rect")
    .attr("x", d => x(d.xval))
    .attr("y", d => y(d.yval))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", d => color(d.count))
    
    
  
  svg.append("g")
    .call(xAxis);
  
  svg.append("g")
    .call(yAxis);
  
  /*svg.append("g")
    .attr("transform", `translate(${width - margin.right}, ${margin.top})`)
    .call(legend);*/
    
  return svg.node();
}
);
  main.variable(observer()).define(["color"], function(color){return(
color(57)
)});
  main.variable(observer("color")).define("color", ["d3","max_val"], function(d3,max_val){return(
d3.scaleLinear()
  .domain([0, max_val])
  .range(["pink", "red"])
)});
  main.variable(observer("x")).define("x", ["d3","age","margin","width"], function(d3,age,margin,width){return(
d3.scaleBand()
      .domain(age)
      .range([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","categories","height","margin"], function(d3,categories,height,margin){return(
d3.scaleBand()
      .domain([...categories].reverse())
      .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x"], function(height,margin,d3,x){return(
g => g
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    //.style("font", "12px verdana")
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    .selectAll("text")	
        .style("text-anchor", "start")
        .attr("dx", "-.8em")
        .attr("dy", ".8em")
        .attr("transform", "rotate(30)")
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y"], function(margin,d3,y){return(
g => g
  .attr("transform", `translate(${margin.left}, 0)`)
  //.style("font", "12px verdana")
  .call(d3.axisLeft(y).ticks(null, "s"))
  .call(g => g.selectAll(".domain").remove())
)});
  main.variable(observer("margin")).define("margin", ["width"], function(width){return(
{top: width/10, right: width/10, bottom: width/5, left: width/5}
)});
  main.variable(observer("max_val")).define("max_val", ["selD"], function(selD){return(
Math.max(...selD[1].map((d) => Object.keys(d).map(e => e != 'index' ? parseInt(d[e]) : 0)).flat())
)});
  main.variable(observer("categories")).define("categories", ["data"], function(data){return(
data.columns.splice(1)
)});
  main.variable(observer("age")).define("age", ["selD"], function(selD){return(
selD[1].map((d) => d.index)
)});
  main.variable(observer("dataSel")).define("dataSel", ["data","data_men","data_women"], function(data,data_men,data_women){return(
[
  ["general", data],
  ["hombres", data_men],         
  ["mujeres", data_women]]
)});
  main.variable(observer("data_women")).define("data_women", ["d3","file_t_w"], function(d3,file_t_w){return(
d3.csvParse(file_t_w)
)});
  main.variable(observer("data_men")).define("data_men", ["d3","file_t_m"], function(d3,file_t_m){return(
d3.csvParse(file_t_m)
)});
  main.variable(observer("data")).define("data", ["d3","file_t"], function(d3,file_t){return(
d3.csvParse(file_t)
)});
  main.variable(observer("file_t_w")).define("file_t_w", ["file_women"], function(file_women){return(
file_women.text()
)});
  main.variable(observer("file_t_m")).define("file_t_m", ["file_men"], function(file_men){return(
file_men.text()
)});
  main.variable(observer("file_t")).define("file_t", ["file"], function(file){return(
file.text()
)});
  main.variable(observer("file_women")).define("file_women", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("formated-data-women.csv")
)});
  main.variable(observer("file_men")).define("file_men", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("formated-data-men.csv")
)});
  main.variable(observer("file")).define("file", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("formated-data per month.csv")
)});
  main.variable(observer("height")).define("height", ["width"], function(width){return(
width
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
