import { EChartOption } from 'echarts';
import { ChartData } from '../chart.types';
import { getFormattedValue } from '../helper';
const radarOption: EChartOption<EChartOption.SeriesRadar> = {
  tooltip: {},
  legend: {
    type: 'scroll',
    itemGap: 8,
    itemWidth: 16,
    itemHeight: 8
  },
  radar: {
    indicator: []
  },
  series: [
    {
      type: 'radar',
      areaStyle: {
        opacity: 0.4
      }
    }
  ]
};

const getOptionByData = (chartData: ChartData<EChartOption.SeriesRadar>): EChartOption => {
  let option = { ...radarOption };
  let serieObj = option.series ? option.series[0] : {};
  option.series = chartData.series.map(obj => ({
    ...serieObj,
    ...obj
  }));
  if (chartData.legend) {
    option.legend = {
      ...option.legend,
      ...chartData.legend
    };
  }
  return option;
};

const labelFormat = (formatter: string): Function => {
  return function (params: any): string {
    return getFormattedValue(params.value, formatter);
  };
};

export default { option: { ...radarOption }, getOptionByData, labelFormat };