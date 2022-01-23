import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HorizontalChartTypes } from "../../../entities/horizontalchart-types";
import * as _ from 'lodash';
import { Chart } from 'src/app/entities/common-types';
import * as echarts from 'echarts';

@Component({
  selector: 'app-horizontal-chart',
  templateUrl: './horizontal-chart.component.html',
  styleUrls: ['./horizontal-chart.component.css']
})
export class HorizontalChartComponent implements OnInit, OnDestroy {

  chart: any = [];

  @Input()
  data: HorizontalChartTypes | undefined;
  @Output()
  option!: echarts.EChartsOption;
  constructor() {

    // Chart.register(...registerables)
  }


  ngOnInit(): void {
    if (this.data) {
      //@ts-ignore
      this.createChart(this.data, this.data.maxDomainInterval, this.data.minDomainInterval, this.data.step)
    }
  }
  ngOnDestroy(): void {
    echarts.disconnect
  }
  createChart(statsBarChart: HorizontalChartTypes, domainMax: number, domainMin: number, step: number) {
    var chartDom = document.getElementById('main')!;
    this.option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        //@ts-ignore
        formatter: function (params) {
          //@ts-ignore

          return params[0].data.prop
        }
      },
      legend: { top: 30 },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },

      animation: true,

      animationThreshold: 2000,
      animationDuration: function (idx) {
        // delay for later data is larger
        return idx * 100;
      },
      yAxis: [
        {
          type: 'category',
          data: Array.from(statsBarChart.chart.map((d: any) => { return d.name })),
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      xAxis: [this.createyAxis(statsBarChart.chart, domainMax, domainMin, step)],
      series: [
        {
          //@ts-ignore
          name: statsBarChart.label,
          //@ts-ignore
          color: statsBarChart.color,
          type: 'bar',

          data: this.createData(statsBarChart.chart)
        }
      ]
    };
    var myChart = echarts.getInstanceByDom(chartDom)
    if (myChart === null) {
      myChart = echarts.init(chartDom);
      this.option && myChart.setOption(this.option);
    }
    // const labels: string[] = Array.from(new Set(StatsBarChart.chart.map((d: any) => d.name)));
    // const values: string[] = Array.from(new Set(StatsBarChart.chart.map((d: any) => d.value)));
    // let delayed: boolean = false;
    // //@ts-ignore
    // var ctx = document.getElementById('myChart').getContext('2d');
    // this.chart = new Chart(ctx, {
    //   type: 'bar',
    //   data: {
    //     labels: labels,
    //     datasets: [{
    //       label: StatsBarChart.label,
    //       data: values,
    //       borderColor: 'rgba(255, 99, 132, 0.2)',
    //       backgroundColor: 'rgba(255, 99, 132, 1)',

    //     }]
    //   },
    //   options: {
    //     indexAxis: 'y',
    //     elements: {
    //       bar: {
    //         borderWidth: 2,
    //       }
    //     },
    //     responsive: true,
    //     scales: {
    //       x: {
    //         suggestedMin: domainMin,
    //         suggestedMax: domainMax
    //       }
    //     },
    //     animation: {
    //       onComplete: () => {
    //         delayed = true;
    //       },
    //       delay: (context) => {
    //         let delay = 0;
    //         //@ts-ignore
    //         if (context.type === 'data' && context.mode === 'default' && !delayed) {
    //           delay = context.dataIndex * 300 + context.datasetIndex * 100;
    //         }
    //         return delay;
    //       },
    //     }
    //   }
    // })
  }

  // verifyMaxDomainInterval(maxDomain: number, StatsBarChart: any) {
  //   if (maxDomain === undefined || maxDomain === null) {
  //     const newMaxDomain = StatsBarChart.sort((a: any, b: any) => b.value - a.value)[0].value;
  //     return newMaxDomain;
  //   }
  //   else
  //     return maxDomain;
  // }
  // verifyMinDomainInterval(minDomain: number, StatsBarChart: any) {
  //   if (minDomain === undefined || minDomain === null) {
  //     const newMinDomain = StatsBarChart.sort((a: any, b: any) => a.value - b.value)[0].value;
  //     return newMinDomain;
  //   }
  //   else
  //     return minDomain;
  // }
  createData(chart: Chart[]) {
    let finalResult: any[] = []
    _.forEach(chart, ch => {
      finalResult.push({ value: ch.value, prop: this.createPropertiesForToolTip(ch.properties, ch.value) })
    })
    return (finalResult)
  }
  createyAxis(chart: Chart[], max: number, min: number, interval: number) {
    let finalResult: any = {
      type: 'value'
    }
    if (max && min) {
      finalResult.max = max
      finalResult.min = min
    }
    else {
      if (max && !min) {
        finalResult.max = max
        finalResult.min = chart.sort((a: any, b: any) => a.value - b.value)[0].value;;
      }
      else {
        if (min && !max) {
          finalResult.min = min
          finalResult.max = chart.sort((a: any, b: any) => b.value - a.value)[0].value;
        }
      }
    }
    if (interval) {
      finalResult.interval = interval;
    }
    return finalResult
  }
  createPropertiesForToolTip(properties: any | string, value?: number) {
    let prop: string = ""
    if (typeof properties === 'object') {
      _.each(properties, (value, key) => {
        prop = prop + `<div style = "font-weight: bold">${key}:${value}`;
      })
      if (value) {
        prop = prop + `<div style = "font-weight: bold">value:${value}</div>`
      }
      return prop
    }
    else {
      if (typeof properties === 'string') {
        if (value) {
          prop = prop + properties + `<div style = "font-weight: bold">value:${value}</div>`
          return properties
        }
        else {
          return properties
        }
      }
      else {
        if (value) {
          return `<div style = "font-weight: bold">value:${value}</div>`
        }
        else {
          return ""
        }
      }
    }
  }
}
