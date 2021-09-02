// https://observablehq.com/@garciaguillermoa/force-directed-graph@149
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(md``)});
  main.variable(observer("chart")).define("chart", ["data","d3","width","height","drag","color","invalidation"], function(data,d3,width,height,drag,color,invalidation)
{
  const links = data.links.map(d => Object.create(d));
  const nodes = data.nodes.map(d => Object.create(d));


  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(function (d) {
        return d.value+30;
    }))
      .force("charge", d3.forceManyBody().distanceMax(90))
      .force("center", d3.forceCenter(width / 2, height / 2));

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", function(d){
        //console.log(d);

       // var countnum = d3.count(d.id);
        //console.log(d.id,countnum);
        return Math.sqrt(2)
        //return countnum?countnum*2:5;
      });  //d => Math.sqrt(d.value)

  const node = svg.append("g")
    .selectAll(".node")
    .data(nodes)
    .join("g")
      .attr('class', 'node')
      .call(drag(simulation));

  node.append('circle')
      .attr("r", function(d){
       // console.log(d);

       // var countnum = d3.count(d.id);
        //console.log(d.id,countnum);
        return d.weight;
        //return countnum?countnum*2:5;
      })
      .attr("fill", color);
  
  node.append("text")
      .text(function(d) {
        return d.id;
      })
      .style('fill', '#000')
      .style('font-size', '12px')
      .attr('x', 6)
      .attr('y', 3);

  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("transform", d => `translate(${d.x}, ${d.y})`);
  });

  invalidation.then(() => simulation.stop());

  return svg.node();
}
);
  main.variable(observer("data")).define("data", ["d3"], function(d3){
//console.log(location.href);
if (location.search.length && location.search.split("q=")[1]){
    return(
d3.json("./data/"+location.search.split("q=")[1]+".json")
)

}
    return(
d3.json("./data/data.json")
)
  });
  main.variable(observer("height")).define("height", function(){return(
980
)});
   main.variable(observer("width")).define("width", function(){return(
1920
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3)
{
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return d => scale(d.group);
}
);
  main.variable(observer("drag")).define("drag", ["d3"], function(d3){return(
simulation => {
  
  function dragstarted(event,d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event,d) {
    d.fx = event.x;
    d.fy = event.y;
    //   d.fx = d.x;
    //d.fy = d.y;

  }
  
  function dragended(d) {
    //if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;

    //d.fx = d3.event.x;
    //d.fy = d3.event.y;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
