export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["formated-data.csv",new URL("./data/formated-data.csv",import.meta.url)],["formated-data-men.csv",new URL("./data/formated-data-men.csv",import.meta.url)],["formated-data-women.csv",new URL("./data/formated-data-women.csv",import.meta.url)],["formated-data16.csv",new URL("./data/formated-data16.csv",import.meta.url)],["formated-data16m.csv",new URL("./data/formated-data16m.csv",import.meta.url)],["formated-data16w.csv",new URL("./data/formated-data16w.csv",import.meta.url)],["formated-data17.csv",new URL("./data/formated-data17.csv",import.meta.url)],["formated-data17m.csv",new URL("./data/formated-data17m.csv",import.meta.url)],["formated-data17w.csv",new URL("./data/formated-data17w.csv",import.meta.url)],["formated-data18.csv",new URL("./data/formated-data18.csv",import.meta.url)],["formated-data18m.csv",new URL("./data/formated-data18m.csv",import.meta.url)],["formated-data18w.csv",new URL("./data/formated-data18w.csv",import.meta.url)],["formated-data19.csv",new URL("./data/formated-data19.csv",import.meta.url)],["formated-data19m.csv",new URL("./data/formated-data19m.csv",import.meta.url)],["formated-data19w.csv",new URL("./data/formated-data19w.csv",import.meta.url)],["formated-data20.csv",new URL("./data/formated-data20.csv",import.meta.url)],["formated-data20m.csv",new URL("./data/formated-data20m.csv",import.meta.url)],["formated-data20w.csv",new URL("./data/formated-data20w.csv",import.meta.url)],["formated-data21.csv",new URL("./data/formated-data21.csv",import.meta.url)],["formated-data21m.csv",new URL("./data/formated-data21m.csv",import.meta.url)],["formated-data21w.csv",new URL("./data/formated-data21w.csv",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Evolucion enfermedades respiratorias por mes según grupo etario`
)});
  main.variable(observer("viewof selD")).define("viewof selD", ["Inputs","dataSel"], function(Inputs,dataSel){return(
Inputs.select(dataSel, {label: "por genero", format: x => x[0], value: dataSel.find(x => x[0] === "general")})
)});
  main.variable(observer("selD")).define("selD", ["Generators", "viewof selD"], (G, _) => G.input(_));
  main.variable(observer("viewof gy")).define("viewof gy", ["Inputs","years"], function(Inputs,years){return(
Inputs.select(years, {label: "por año", format: x => x[0], value: years.find(x => x[0] === "general")})
)});
  main.variable(observer("gy")).define("gy", ["Generators", "viewof gy"], (G, _) => G.input(_));
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
    .style("background","white")
    .style("min-width","100px")
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
  main.variable(observer("color")).define("color", ["d3","max_val"], function(d3,max_val){return(
d3.scaleLinear()
    .domain([0, max_val/2,max_val])
    .range(d3.schemeOrRd[3])
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
[["general", data], ["hombres", data_men], ["mujeres",data_women]]
)});
  main.variable(observer("data_women")).define("data_women", ["d3","FileSel","gy"], async function(d3,FileSel,gy){return(
d3.csvParse(await FileSel[gy[1]][1][2].text())
)});
  main.variable(observer("data_men")).define("data_men", ["d3","FileSel","gy"], async function(d3,FileSel,gy){return(
d3.csvParse(await FileSel[gy[1]][1][1].text())
)});
  main.variable(observer("data")).define("data", ["d3","FileSel","gy"], async function(d3,FileSel,gy){return(
d3.csvParse(await FileSel[gy[1]][1][0].text())
)});
  main.variable(observer("FileSel")).define("FileSel", ["FileAttachment"], function(FileAttachment){return(
[["general", [FileAttachment("formated-data.csv"),    FileAttachment("formated-data-men.csv"), FileAttachment("formated-data-women.csv")]],
           ["2016", [FileAttachment("formated-data16.csv"), FileAttachment("formated-data16m.csv"), FileAttachment("formated-data16w.csv")]],
           ["2017", [FileAttachment("formated-data17.csv"), FileAttachment("formated-data17m.csv"), FileAttachment("formated-data17w.csv")]],
           ["2018", [FileAttachment("formated-data18.csv"), FileAttachment("formated-data18m.csv"), FileAttachment("formated-data18w.csv")]],
           ["2019", [FileAttachment("formated-data19.csv"), FileAttachment("formated-data19m.csv"), FileAttachment("formated-data19w.csv")]],
           ["2020", [FileAttachment("formated-data20.csv"), FileAttachment("formated-data20m.csv"), FileAttachment("formated-data20w.csv")]],
           ["2021", [FileAttachment("formated-data21.csv"), FileAttachment("formated-data21m.csv"), FileAttachment("formated-data21w.csv")]]]
)});
  main.variable(observer("years")).define("years", function(){return(
[["todos los años",0],["2016",1],["2017",2],["2018",3],["2019",4],["2020",5],["2021",6]]
)});
  main.variable(observer("height")).define("height", ["width"], function(width){return(
width
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
