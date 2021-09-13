import { EChartOption } from 'echarts';
import { ChartData } from '../chart.types';
import { getFormattedValue } from '../helper';
const lineOption: EChartOption<EChartOption.SeriesLine> = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    type: 'scroll',
    formatter: function (name: string) {
      // return helper.textTruncate(name);
      return name;
    },
    itemGap: 8,
    itemWidth: 16,
    itemHeight: 8
    // tooltip: {
    //   show: true
    // }
  },
  xAxis: {
    type: 'category', // switch x and y just set yAxis type to 'category'
    gridIndex: 0
  },
  yAxis: {
    gridIndex: 0
  },
  series: [
    {
      type: 'line',
      showSymbol: false,
      step: false,
      smooth: true,
      xAxisIndex: 0,
      yAxisIndex: 0
    }
  ]
};

const areaOption: EChartOption<EChartOption.SeriesLine> = {
  ...lineOption,
  series: [{ type: 'line', areaStyle: { opacity: 0.4 }, smooth: true, showSymbol: false, step: false }]
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
const labelFormat = (formatter: string): Function => {
  return function (params: any): string {
    return getFormattedValue(params.value, formatter);
  };
};

export const lineChart = {
  option: { ...lineOption },
  getOptionByData: getOptionByData({ ...lineOption }),
  axisLabelFormat,
  labelFormat: labelFormat
};
export const areaChart = {
  option: { ...areaOption },
  getOptionByData: getOptionByData({ ...areaOption }),
  axisLabelFormat,
  labelFormat: labelFormat
};