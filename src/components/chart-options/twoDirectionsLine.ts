import { EChartOption } from 'echarts';
import { ChartData } from '../chart.types';
import { getFormattedValue } from '../helper';
const twoDirectionsLineOption: EChartOption<EChartOption.SeriesLine> = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {},
  xAxis: [
    {
      type: 'category'
    },
    {
      gridIndex: 1,
      type: 'category',
      position: 'top'
    }
  ],
  yAxis: [
    {
      gridIndex: 0
    },
    {
      gridIndex: 1,
      inverse: true
    }
  ],
  grid: [
    {
      bottom: '50%'
    },
    {
      top: '50%'
    }
  ],
  series: [
    {
      type: 'line',
      smooth: true,
      showSymbol: false
    },
    { type: 'line', smooth: true, xAxisIndex: 1, yAxisIndex: 1, showSymbol: false }
  ]
};
const twoDirectionsAreaOption: EChartOption<EChartOption.SeriesLine> = {
  ...twoDirectionsLineOption,
  series: [
    {
      type: 'line',
      areaStyle: { opacity: 0.4 },
      smooth: true,
      showSymbol: false
    },
    { type: 'line', areaStyle: { opacity: 0.4 }, smooth: true, xAxisIndex: 1, yAxisIndex: 1, showSymbol: false }
  ]
};

const getOptionByData = (opt: EChartOption<EChartOption.SeriesLine>) => (
  chartData: ChartData<EChartOption.SeriesLine>
): EChartOption => {
  let option = { ...opt };
  let serieObj = option.series ? option.series[0] : {};
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
  return option;
};

const axisLabelFormat = (formatter: string): Function => {
  return function (val: number) {
    return getFormattedValue(val, formatter);
  };
};

export const twoDirectionsLine = {
  option: { ...twoDirectionsLineOption },
  getOptionByData: getOptionByData({ ...twoDirectionsLineOption }),
  axisLabelFormat
};
export const twoDirectionsArea = {
  option: { ...twoDirectionsAreaOption },
  getOptionByData: getOptionByData({ ...twoDirectionsAreaOption }),
  axisLabelFormat
};