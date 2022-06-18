import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import * as echarts from 'echarts';

@Component({
  selector: 'app-horizontal-chart',
  templateUrl: './horizontal-chart.component.html',
  styleUrls: ['./horizontal-chart.component.css']
})
export class HorizontalChartComponent   {

  // chart: any = [];

  // @Input()
  // data: HorizontalChartTypes | undefined;
  // @Output()
  // option!: echarts.EChartsOption;
  // constructor() {

  //   // Chart.register(...registerables)
  // }


  // ngOnInit(): void {
  //   if (this.data) {
  //     //@ts-ignore
  //     this.createChart(this.data, this.data.maxDomainInterval, this.data.minDomainInterval, this.data.step)
  //   }
  // }
  // ngOnDestroy(): void {
  //   echarts.disconnect
  // }
  // createChart(statsBarChart: HorizontalChartTypes, domainMax: number, domainMin: number, step: number) {
  //   var chartDom = document.getElementById('main')!;
  //   this.option = {
  //     tooltip: {
  //       trigger: 'axis',
  //       axisPointer: {
  //         type: 'shadow'
  //       },
  //       //@ts-ignore
  //       formatter: function (params) {
  //         //@ts-ignore

  //         return params[0].data.prop
  //       }
  //     },
  //     legend: { top: 30 },
  //     grid: {
  //       left: '3%',
  //       right: '4%',
  //       bottom: '3%',
  //       containLabel: true
  //     },

  //     animation: true,

  //     animationThreshold: 2000,
  //     animationDuration: function (idx) {
  //       // delay for later data is larger
  //       return idx * 100;
  //     },
  //     yAxis: [
  //       {
  //         type: 'category',
  //         data: Array.from(statsBarChart.chart.map((d: any) => { return d.name })),
  //         axisTick: {
  //           alignWithLabel: true
  //         }
  //       }
  //     ],
  //     xAxis: [this.createyAxis(statsBarChart.chart, domainMax, domainMin, step)],
  //     series: [
  //       {
  //         //@ts-ignore
  //         name: statsBarChart.label,
  //         //@ts-ignore
  //         color: statsBarChart.color,
  //         type: 'bar',

  //         data: this.createData(statsBarChart.chart)
  //       }
  //     ]
  //   };
  //   var myChart = echarts.getInstanceByDom(chartDom)
  //   if (myChart === null) {
  //     myChart = echarts.init(chartDom);
  //     this.option && myChart.setOption(this.option);
  //   }

  // }

  // createData(chart: Chart[]) {
  //   let finalResult: any[] = []
  //   _.forEach(chart, ch => {
  //     finalResult.push({ value: ch.value, prop: this.createPropertiesForToolTip(ch.properties, ch.value) })
  //   })
  //   return (finalResult)
  // }
  // createyAxis(chart: Chart[], max: number, min: number, interval: number) {
  //   let finalResult: any = {
  //     type: 'value'
  //   }
  //   if (max && min) {
  //     finalResult.max = max
  //     finalResult.min = min
  //   }
  //   else {
  //     if (max && !min) {
  //       finalResult.max = max
  //       finalResult.min = chart.sort((a: any, b: any) => a.value - b.value)[0].value;;
  //     }
  //     else {
  //       if (min && !max) {
  //         finalResult.min = min
  //         finalResult.max = chart.sort((a: any, b: any) => b.value - a.value)[0].value;
  //       }
  //     }
  //   }
  //   if (interval) {
  //     finalResult.interval = interval;
  //   }
  //   return finalResult
  // }
  // createPropertiesForToolTip(properties: any | string, value?: number) {
  //   let prop: string = ""
  //   if (typeof properties === 'object') {
  //     _.each(properties, (value, key) => {
  //       prop = prop + `<div style = "font-weight: bold">${key}:${value}`;
  //     })
  //     if (value) {
  //       prop = prop + `<div style = "font-weight: bold">value:${value}</div>`
  //     }
  //     return prop
  //   }
  //   else {
  //     if (typeof properties === 'string') {
  //       if (value) {
  //         prop = prop + properties + `<div style = "font-weight: bold">value:${value}</div>`
  //         return properties
  //       }
  //       else {
  //         return properties
  //       }
  //     }
  //     else {
  //       if (value) {
  //         return `<div style = "font-weight: bold">value:${value}</div>`
  //       }
  //       else {
  //         return ""
  //       }
  //     }
  //   }
  // }
}
