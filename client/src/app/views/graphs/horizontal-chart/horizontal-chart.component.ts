import {Component, Input, OnInit} from '@angular/core';
import * as d3 from "d3";
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-horizontal-chart',
  templateUrl: './horizontal-chart.component.html',
  styleUrls: ['./horizontal-chart.component.css']
})
export class HorizontalChartComponent implements OnInit {

  // private width: number;
  // private height: number;
  //
  // margin = {top: 20, right: 20, bottom: 30, left: 40};
  // x: any;
  // y: any;
  // svg: any;
  // g: any;
  chart: any = [];
  @Input()
  data: any;

  constructor() {
    // this.width = 510 - this.margin.left - this.margin.right;
    // this.height = 500 - this.margin.top - this.margin.bottom;
    Chart.register(...registerables)
  }


  ngOnInit(): void {

    this.createChart({chart:this.data.chart,label:this.data.label},this.verifyMaxDomainInterval(this.data.maxDomainInterval,this.data.chart),this.verifyMinDomainInterval(this.data.minDomainInterval,this.data.chart))

  }

  createChart(StatsBarChart:any,domainMax:number, domainMin:number) {

    const labels:string[] = Array.from(new Set(StatsBarChart.chart.map((d:any) => d.name)));
    const values:string[] = Array.from(new Set(StatsBarChart.chart.map((d:any) => d.value)));
    let delayed:boolean = false;
    //@ts-ignore
    var ctx = document.getElementById('myChart').getContext('2d');
    this.chart = new Chart(ctx, {
      type:'bar',
      data: {
        labels: labels,
        datasets: [{
          label: StatsBarChart.label,
          data: values,
          borderColor: 'rgba(255, 99, 132, 0.2)',
          backgroundColor: 'rgba(255, 99, 132, 1)',

        }]
      },
      options: {
        indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 2,
          }
        },
        responsive: true,
        scales: {
          x: {
            suggestedMin: domainMin,
            suggestedMax: domainMax
          }
        },
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            //@ts-ignore
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        }
      }
    })





    // this.initSvg();
    // this.initAxis(StatsBarChart,domainMax, domainMin);
    // this.drawBars(StatsBarChart,domainMin);
    // this.createAnimation();
  }
  // initSvg() {
  //   this.svg = d3.select('#barChart')
  //     .append('svg')
  //     .attr('width', '80%')
  //     .attr('height', '160%')
  //     .attr('viewBox', '0 0 900 500');
  //   this.g = this.svg.append('g')
  //     .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  // }
  //
  // initAxis(StatsBarChart: any,domainMax:number, domainMin:number) {
  //   console.log(domainMin)
  //   this.x  = d3.scaleLinear()
  //     .domain([domainMin, domainMax])
  //     .range([ 0, this.width]);
  //
  //   this.svg.append("g")
  //     .attr("transform", `translate(0,${this.height})`)
  //     .call(d3.axisBottom(this.x))
  //     .selectAll("text")
  //     .attr("transform", "translate(-10,0)rotate(-45)")
  //     .style("text-anchor", "end")
  //   this.y = d3.scaleBand()
  //     .range([ domainMin, this.width  ])
  //     .domain(StatsBarChart.map((d:any) => d.name))
  //     .padding(0.5);
  //   this.svg.append("g")
  //     .call(d3.axisLeft(this.y));
  // }
  //
  // drawBars(StatsBarChart: any,domainMin:number) {
  //   this.svg.selectAll("myRect")
  //     .data(StatsBarChart)
  //     .join("rect")
  //     .attr("x", this.x(domainMin) )
  //     .attr("y", (d:any) => this.y(d.name))
  //     .attr("width", (d:any) => domainMin)
  //     .attr("height", this.y.bandwidth())
  //     .attr("fill", "#69b3a2")
  // }
  //
  // createAnimation() {
  //   this.svg.selectAll("rect")
  //     .transition()
  //     .duration(800)
  //     .attr("width", (d:any) => this.x(d.value))
  //     .delay((d:any,i:number) => {console.log(i); return i*100})
  // }

  verifyMaxDomainInterval(maxDomain:number,StatsBarChart:any) {
    if(maxDomain === undefined || maxDomain === null) {
      const newMaxDomain = StatsBarChart.sort((a:any,b:any)=>b.value-a.value)[0].value;
    return newMaxDomain;
    }
    else
      return maxDomain;
  }
  verifyMinDomainInterval(minDomain:number,StatsBarChart:any) {
    if(minDomain === undefined || minDomain === null) {
      const newMinDomain = StatsBarChart.sort((a:any,b:any)=>a.value-b.value)[0].value;
      return newMinDomain;
    }
    else
      return minDomain;
  }
}
