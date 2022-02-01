import {
  EChartsOption,
  HeatmapSeriesOption,
  VisualMapComponentOption
} from 'echarts';
import { ChartData, ChartTypeOption } from '../chart.types';
const heatmapOption: ChartTypeOption = {
  tooltip: {
    position: 'top'
  },
  grid: {
    height: '70%',
    top: '10%'
  },
  xAxis: {
    type: 'category',
    splitArea: {
      show: true
    }
  },
  yAxis: {
    type: 'category',
    splitArea: {
      show: true
    }
  },
  visualMap: [
    {
      // min: 0,
      // max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '10%'
    }
  ],
  series: [
    {
      type: 'heatmap',
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};

const getOptionByData = (
  chartData: ChartData<HeatmapSeriesOption>
): EChartsOption => {
  let option = { ...heatmapOption };
  let serieObj = option.series ? option.series[0] : {};
  let visualMapObj: VisualMapComponentOption = option.visualMap
    ? option.visualMap[1]
    : {};
  option.series = chartData.series.map(obj => ({
    ...serieObj,
    ...obj
  })) as HeatmapSeriesOption[];
  if (chartData.xAxis) {
    option.xAxis = {
      ...option.xAxis,
      ...chartData.xAxis
    };
  }
  if (chartData.yAxis) {
    option.yAxis = {
      ...option.yAxis,
      ...chartData.yAxis
    };
  }
  if (chartData.legend) {
    option.legend = {
      ...option.legend,
      ...chartData.legend
    };
  }
  if (chartData.visualMap && Array.isArray(chartData.visualMap)) {
    option.visualMap = chartData.visualMap.map(obj => ({
      ...visualMapObj,
      ...obj
    })) as VisualMapComponentOption[];
  }
  return option;
};

export const heatmapChart = { option: { ...heatmapOption }, getOptionByData };
