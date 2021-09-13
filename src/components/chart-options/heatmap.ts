import { EChartOption } from 'echarts';
import { ChartData } from '../chart.types';
const heatmapOption: EChartOption<EChartOption.SeriesHeatmap> = {
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

const getOptionByData = (chartData: ChartData<EChartOption.SeriesHeatmap>): EChartOption => {
  let option = { ...heatmapOption };
  let serieObj = option.series ? option.series[0] : {};
  let visualMapObj: EChartOption.VisualMap = option.visualMap ? option.visualMap[1] : {};
  option.series = chartData.series.map(obj => ({
    ...serieObj,
    ...obj
  }));
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
  if (chartData.visualMap && chartData.visualMap.length) {
    option.visualMap = chartData.visualMap.map(obj => ({
      ...visualMapObj,
      ...obj
    })) as Array<EChartOption.VisualMap>;
  }
  return option;
};

export default { option: { ...heatmapOption }, getOptionByData };