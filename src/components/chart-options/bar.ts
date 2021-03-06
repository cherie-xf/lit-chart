import { BarSeriesOption, SeriesOption } from 'echarts';
import { ChartData, ChartOption, ChartTypeOption } from '../chart.types';
import { getFormattedValue } from '../helper';
const barOption: ChartTypeOption = {
  grid: {
    containLabel: true
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    type: 'scroll',
    itemGap: 8,
    itemWidth: 16,
    itemHeight: 8
  },
  xAxis: {
    type: 'category', // switch x and y just set yAxis type to 'category'
    gridIndex: 0,
    axisLabel: {
      rotate: 15,
      interval: 0 // force to show all labels
    }
  },
  yAxis: {
    gridIndex: 0
  },
  series: [
    {
      type: 'bar',
      stack: '', //Name of stack. On the same category axis, the series with the same stack name would be put on top of each other.
      xAxisIndex: 0,
      yAxisIndex: 0
    }
  ]
};

const getOptionByData = (
  chartData: ChartData<BarSeriesOption>
): ChartOption => {
  let option = { ...barOption };
  let serieObj = option.series ? option.series[0] : {};
  option.series = chartData.series.map(obj => ({
    ...serieObj,
    ...obj
  })) as SeriesOption[];
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
const labelFormat = (formatter: string): Function => {
  return function (params: any): string {
    return getFormattedValue(params.value, formatter);
  };
};

export const barChart = {
  option: { ...barOption },
  getOptionByData,
  axisLabelFormat,
  labelFormat
};
