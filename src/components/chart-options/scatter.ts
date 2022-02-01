import { EChartsOption, ScatterSeriesOption } from 'echarts';
import { ChartData, ChartTypeOption } from '../chart.types';
const scatterOption: ChartTypeOption = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    type: 'scroll'
  },
  series: [
    {
      type: 'scatter'
    }
  ]
};

const getOptionByData = (
  chartData: ChartData<ScatterSeriesOption>
): EChartsOption => {
  let option = { ...scatterOption };
  let serieObj = option.series ? option.series[0] : {};
  option.series = chartData.series.map(obj => ({
    ...serieObj,
    ...obj
  })) as ScatterSeriesOption[];
  return option;
};

export const scatterChart = { option: { ...scatterOption }, getOptionByData };
