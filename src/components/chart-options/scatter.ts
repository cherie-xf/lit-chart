import { EChartOption } from 'echarts';
import { ChartData } from '../chart.types';
const scatterOption: EChartOption<EChartOption.SeriesScatter> = {
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

const getOptionByData = (chartData: ChartData<EChartOption.SeriesScatter>): EChartOption => {
  let option = { ...scatterOption };
  let serieObj = option.series ? option.series[0] : {};
  option.series = chartData.series.map(obj => ({
    ...serieObj,
    ...obj
  }));
  return option;
};

export default { option: { ...scatterOption }, getOptionByData };