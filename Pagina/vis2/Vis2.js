import { Runtime, Library, Inspector } from "../static/runtime.js";
export default function define(runtime, observer, data) {
  const main = runtime.module();
  const fileAttachments = new Map([
    [
      "data.csv",
      new URL(
        "../vis2/data",
        import.meta.url
      ),
    ],
    [
      "hombres.csv",
      new URL(
        "../vis2/hombres",
        import.meta.url
      ),
    ],
    [
      "mujeres.csv",
      new URL(
        "../vis2/mujeres",
        import.meta.url
      ),
    ]
  ]);
  main.builtin(
    "FileAttachment",
    runtime.fileAttachments((name) => fileAttachments.get(name))
  );
  main.variable(observer()).define(["md"], function (md) {
    return md`
# Grafico Mamadisimo`;
  });
  main
    .variable(observer("chart"))
    .define("chart", ["d3", "DOM", "tab_data"], function (d3, DOM, tab_data) {
      var c1w = 390,
        c2w = 80,
        c3w = 40,
        r1h = 150,
        w = 1200,
        h = w,
        pad = 20,
        left_pad = 50;

      var svg = d3
        .select(DOM.svg(c1w + c2w + c3w + w + pad + 30, r1h + h))
        .style("width", "100%")
        .style("height", "auto")

      var traits = tab_data.columns.filter(
        (x) => !(x in { Z: 0, "Key Skill": 0, Company: 0, GLOSA: 0 })
      );
      var candidates = tab_data.map((r) => r.GLOSA);

      var row_data = [],
        row,
        prop;
      for (row of tab_data) {
        for (prop of traits) {
          row_data.push({
            name: row["GLOSA"],
            prop: prop,
            value: row[prop],
          });
        }
      }

      var x_step = (w - pad - left_pad) / (traits.length + 1),
        y_step = (h - pad * 2 - pad) / (candidates.length + 1),
        x_range = traits.map(
          (v, i) => c1w + c2w + c3w + left_pad + (1 + x_step) * i
        ),
        y_range = candidates.map((v, i) => r1h + pad + (1 + y_step) * i),
        x = d3.scaleOrdinal().domain(traits).range(x_range),
        y = d3.scaleOrdinal().domain(candidates).range(y_range);

      var max_r = 500,
        r = d3.scaleLinear().range([1, 550]);

      var classinate = (t) => t.replace(/\s|ñ|'+/gi, "_");
      var opacity = (m) =>
        m in { "Managed Money": 0, Location: 0 }
          ? "0.5"
          : m in { Municipal: 0 }
          ? "0.3"
          : "1.0";

      var onMouseOver = function (d) {
        console.log(d);
        var name = classinate(d["name"]);
        var prop = classinate(d["prop"]);
        svg.selectAll(`text.label.${prop}.${name}`).attr("display", "block");
      };

      var onMouseOut = function (d) {
        var name = classinate(d["name"]);
        var prop = classinate(d["prop"]);
        svg.selectAll(`text.label.${prop}.${name}`).attr("display", "none");
      };

      var circle_groups = svg
        .selectAll("g.cgroup")
        .data(row_data, (d, i) => `cgroup${i}`)
        .enter()
        .append("g")
        .attr("class", "cgroup")
        .attr("opacity", (d) => opacity(d["prop"]))
        .on("mouseleave", onMouseOut)
        .on("mouseenter", (d) => {
          onMouseOver(d);
        });

      var circles = circle_groups
        .append("circle")
        .attr(
          "class",
          (d) => "circle " + classinate(d["prop"]) + " " + classinate(d["name"])
        )
        .attr("cx", function (d) {
          return x(d["prop"]);
        })
        .attr("cy", function (d) {
          return y(d["name"]);
        });

      circle_groups
        .append("text")
        .attr(
          "class",
          (d) => "label " + classinate(d["prop"]) + " " + classinate(d["name"])
        )
        .attr("display", "none")
        .attr("text-anchor", "middle")
        .style('font-weight','bold')
        .style("font-size", "16px")
        .attr("stroke", "black")
        .attr("x", function (d) {
          return x(d["prop"]);
        })
        .attr("y", function (d) {
          return y(d["name"]);
        })
        .text(function (d) {
          return d["value"];
        });

      var trait_labels = svg
        .selectAll("text.trait")
        .data(traits)
        .enter()
        .append("text")
        .attr("class", "trait")
        .attr("x", (d) => x(d))
        .attr("y", r1h - 10)
        .style('font-weight','bold')
        .style("font-size", "16px")
        .attr("opacity", (d) => opacity(d))
        .attr("transform", (d) => `rotate(-40 ${x(d)},${r1h - 10})`)
        .text((d) => d);

      var candidate_labels = svg
        .selectAll("text.candidate")
        .data(candidates)
        .enter()
        .append("text")
        .attr("class", "candidate")
        .attr("x", 10)
        .attr("y", (d) => y(d))
        .style('font-weight','bold')
        .style("font-size", "20px")
        .text((d) => d);

      circles
        .transition()
        .duration(800)
        .attr("r", function (d) {
          return r(d["value"]);
        })
        .attr("fill", (d) => d3.interpolateRdYlGn(d["value"] * 50));

      return svg.node();
    });
  main.variable(observer("d3")).define("d3", ["require"], function (require) {
    return require("https://d3js.org/d3.v5.min.js");
  });
  main
    .variable(observer("tab_data"))
    .define("tab_data", ["FileAttachment"], function (FileAttachment) {
      if (document.getElementById("id-todos").checked) {
        return FileAttachment("data.csv").csv();
      } else if (document.getElementById("id-mujer").checked) {
        return FileAttachment("mujeres.csv").csv();
      }
      return FileAttachment("hombres.csv").csv();
    });
  return main;
}


window.addEventListener("load", function () {
  
    var cbs = document.forms["selector-sexo"].elements["selectors"];
    for (var i = 0, cbLen = cbs.length; i < cbLen; i++) {
      cbs[i].addEventListener("change", function () {
        if (this.checked) {
          const runtime = new Runtime();
            const main = runtime.module(define, name => {
            if (name == 'chart') {
                return new Inspector(document.getElementById("puto"))
            }
            });
        } 
      });
    }
  });
