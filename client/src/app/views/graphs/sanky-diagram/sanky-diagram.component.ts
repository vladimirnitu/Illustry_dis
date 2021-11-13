import {Component, Input, OnInit} from '@angular/core';
import * as d3 from 'd3'
import * as d3Sankey from 'd3-sankey'
import {range} from "rxjs";

@Component({
  selector: 'app-sanky-diagram',
  templateUrl: './sanky-diagram.component.html',
  styleUrls: ['./sanky-diagram.component.css']
})
export class SankyDiagramComponent implements OnInit {
  width = 954;
  height = 600;
  links = [];
  nodes = [];
  color: any;
  graph = {nodes: [], "links": [], units: ""};
  nodeAlign: any;
  nodeGroup:any;
  @Input()
  data: any;

  constructor() {
  }

  ngOnInit(): void {
    this.nodes = this.data.nodes;
    // @ts-ignore
    this.nodes.map((node,i) => node['index']=i )
    this.links = modifyLinks(this.nodes,this.data.links);
    //@ts-ignore
    this.graph = {links: this.links, nodes: this.nodes};
    this.nodeAlign = pickNodeAlign("justify")
    this.DrawChart(this.graph,this.nodeAlign)
  }


  private DrawChart(energy: any, nodeAlign: any) {

    console.log(energy)
    var svg = d3.select('#sankey')
      .append('svg')
      .attr('width', 1000)
      .attr('height', 500);

    var formatNumber = d3.format(",.0f"),
      format = function (d: any) { return formatNumber(d) + " TWh"; },
      color = d3.scaleOrdinal(d3.schemeCategory10)

    var sankey = d3Sankey.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .nodeAlign(nodeAlign)
      .extent([[1, 1], [1000 - 1, 500 - 6]]);
    //
    // var link = svg.append("g")
    //   .attr("class", "links")
    //   .attr("fill", "none")
    //   .attr("stroke", "#000")
    //   .attr("stroke-opacity", 0.2)
    //   .selectAll("path");
    //
    // var node = svg.append("g")
    //   .attr("class", "nodes")
    //   .attr("font-family", "sans-serif")
    //   .attr("font-size", 10)
    //   .selectAll("g");

    const uid = `O-${Math.random().toString(16).slice(2)}`;


    sankey(energy);

    energy.links.forEach((link:any) => {
      link.gradient = {id:`${uid}${Math.random().toString(16).slice(2)}`}
      link.path = {id:`${uid}${Math.random().toString(16).slice(2)}`}
    });
    energy.nodes.forEach((node:any) => {
      node.color = color(node.group);
    });
    const defs = svg.append("defs");
    const gradients = defs.selectAll("linearGradient")
      .data(energy.links)
      .enter()
      .append("linearGradient")
      .attr("id", (d:any) => d.gradient.id)
    gradients.append("stop").attr("offset", 0.0).attr("stop-color", (d:any) => d.source.color);
    gradients.append("stop").attr("offset", 1.0).attr("stop-color", (d:any) => d.target.color);
  console.log(gradients)
    const view = svg.append("g")
      .classed("view", true)
      .attr("transform", `translate(10, 10)`);
    const nodes = view.selectAll("rect.node")
      .data(energy.nodes)
      .enter()
      .append("rect")
      .classed("node", true)
      .attr("id", (d:any) => `node-${d.index}`)
      .attr("x", (d:any) => d.x0)
      .attr("y", (d:any) => d.y0)
      .attr("width", (d:any) => d.x1 - d.x0)
      .attr("height", (d:any) => Math.max(1, d.y1 - d.y0))
      .attr("fill", (d:any) => d.color)
      .attr("opacity", 0.9);

    nodes.append("title").text((d:any) => `${d.name}\n${format(d.value)}`);


    view.selectAll("text.node")
      .data(energy.nodes)
      .enter()
      .append("text")
      .classed("node",true)
      .attr("x", (d:any) => d.x1)
      .attr("dx", 6)
      .attr("y", (d:any) => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("fill", "black")
      .attr("text-anchor", "start")
      .attr("font-size", 10)
      .attr("font-family", "Arial, sans-serif")
      .text((d:any) => d.name)
      .filter((d:any) => d.x1 > 20 / 2)
      .attr("x", (d:any) => d.x0)
      .attr("dx", -6)
      .attr("text-anchor", "end");


    const links = view.selectAll("path.link")
      .data(energy.links)
      .enter()
      .append("path")
      .classed("link", true)
      // @ts-ignore
      .attr("d", d3Sankey.sankeyLinkHorizontal())
      .attr("stroke", "black")
      .attr("stroke-opacity", 0.1)
      .attr("stroke-width", (d:any) => Math.max(1, d.width))
      .attr("fill", "none");

    links.append("title").text((d:any) => `${d.source.name} -> ${d.target.name}\n${format(d.value)}`);


    function setDash(link:any) {
      let el = view.select(`#${link.path.id}`);

      // @ts-ignore
      let length = el.node().getTotalLength();
      el.attr("stroke-dasharray", `${length}${length}`)
        .attr("stroke-dashoffset", length);
    }

    const gradientLinks = view.selectAll("path.gradient-link")
      .data(energy.links)
      .enter()
      .append("path")
      .classed("gradient-link", true)
      .attr("id", (d:any) => d.path.id)
      // @ts-ignore
      .attr("d", d3Sankey.sankeyLinkHorizontal())
      //@ts-ignore
      .attr("stroke", (d:any) =>d.gradient)
      .attr("stroke-opacity", 0)
      .attr("stroke-width", (d:any) => Math.max(1, d.width))
      .attr("fill", "none")
      .each(setDash);

    function branchAnimate(node:any) {

      let links = view.selectAll("path.gradient-link")
        .filter((link) => {
          return node.sourceLinks.indexOf(link) !== -1;
        });
      let nextNodes:any = [];
      links.each((link:any) => {
        nextNodes.push(link.target);
      });
      links
        .attr("stroke",(d:any) =>color(d.source.group) )
        .attr("stroke-opacity", 0.5)
        .transition()
        .duration(900)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .on("end", () => {
          nextNodes.forEach((node:any) => {
            branchAnimate(node);
          });
        });
    }

    function branchClear() {
      gradientLinks.transition();
      gradientLinks
        .attr("stroke", 0)
        .attr("stroke-opactiy", 0)
        .each(setDash);
    }

    nodes.on("mouseover", branchAnimate)
      .on("mouseout", branchClear);

    return svg.node();
    // // @ts-ignore
    // link = link
    //   .data(energy.links)
    //   .enter().append("path")
    //   // @ts-ignore
    //   .attr("d", d3Sankey.sankeyLinkHorizontal())
    //   .attr("stroke", (d:any) =>  color(d.source.group))
    //   .attr("stroke-width", function (d: any) { return Math.max(1, d.width); })
    //   .style("mix-blend-mode", "multiply");
    //
    // link.append("title")
    //   .text(function (d: any) { return d.source.name +  "→" + d.target.name + "\n" + format(d.value); });
    //
    // // @ts-ignore
    // node = node
    //   .data(energy.nodes)
    //   .enter().append("g");
    //
    // node.append("rect")
    //   .attr("x", function (d: any) { return d.x0; })
    //   .attr("y", function (d: any) { return d.y0; })
    //   .attr("height", function (d: any) { return d.y1 - d.y0; })
    //   .attr("width", function (d: any) { return d.x1 - d.x0; })
    //   .attr("fill", function (d: any) { return color(d.name.replace(/ .*/, "")); })
    //   .attr("stroke", "#000")
    //   .attr("fill", (d:any) => color(d.group));
    //
    // node.append("text")
    //   .attr("x", function (d: any) { return d.x0 - 6; })
    //   .attr("y", function (d: any) { return (d.y1 + d.y0) / 2; })
    //   .attr("dy", "0.35em")
    //   .attr("text-anchor", "end")
    //   .text(function (d: any) { return d.name; })
    //   .filter(function (d: any) { return d.x0 < 1000 / 2; })
    //   .attr("x", function (d: any) { return d.x1 + 6; })
    //   .attr("text-anchor", "start");
    //
    // node.append("title")
    //   .text(function (d: any) { return d.name + "\n" + format(d.value); });
    //
    // link
    //   .append("linearGradient")
    // //@ts-ignore
    //   .attr("id", (d:any) => `${uid}-link-${d.index}`)
    //   .attr("gradientUnits", "userSpaceOnUse")
    //   .attr("x1", (d:any) => d.source.x1)
    //   .attr("x2", (d:any) => d.target.x0)
    //   .call(gradient =>
    //   gradient.append("stop")
    //     .attr("offset", "0%")
    //     // @ts-ignore
    //     .attr("stop-color", (d:any) =>{color(d.source.group) }))
    //   .call(gradient => gradient.append("stop")
    //     .attr("offset", "0%")
    //     // @ts-ignore
    //     .attr("stop-color", (d:any) => color(d.target.group)))
    //
    // // .call(gradient => gradient.append("stop")
    //   //   .attr("offset", "100%")
    //   //   // @ts-ignore
    //   //   .attr("stop-color", ({target: {index: i}}) => color(G[i])))
    // return Object.assign(svg.node(), {scales: {color}});

  }

}

function pickNodeAlign(nodeAlign:any) {
  if (nodeAlign === 'left') {
    return  d3Sankey.sankeyLeft
  } else if (nodeAlign === 'right') {
    return d3Sankey.sankeyRight
  } else if (nodeAlign === 'center')
    return d3Sankey.sankeyCenter
  else
    return d3Sankey.sankeyJustify
}

function modifyLinks(nodes:any,links: any) {
  links.forEach((link:any) => {
    nodes.forEach((node:any) => {
      if (link.source === node.name)
      {
        link.source = node.index
      }
      if(link.target === node.name) {
        link.target = node.index
      }

    })
  })
  console.log(links)
  return links;
}
