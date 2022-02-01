import {
  DatasetComponentOption,
  EChartsOption,
  RadarComponentOption,
  RadarSeriesOption
} from 'echarts';
import { ChartData, ChartTypeOption } from '../chart.types';
import { getFormattedValue } from '../helper';
const radarOption: ChartTypeOption = {
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

const getOptionByChartdataset = (
  dataset: DatasetComponentOption
): ChartTypeOption => {
  const source = dataset.source as Array<any>;
  let option = { ...radarOption };
  if (Array.isArray(source) && source.length > 1) {
    const names = source[0].slice(1);
    const groupNames = source.slice(1).map(row => row[0]);
    const rows = source.slice(1).map(row => row.slice(1));
    option.radar = getRadarFromDataset(names, rows);
    if (option.series) {
      option.series = option.series.map(obj => {
        return {
          ...obj,
          data: rows.map((row, idx) => ({
            name: groupNames[idx],
            value: row
          }))
        };
      }) as RadarSeriesOption[];
    }
  }
  return option;
};

const getOptionByData = (
  chartData: ChartData<RadarSeriesOption>
): EChartsOption => {
  let option = { ...radarOption };
  let serieObj = option.series ? option.series[0] : {};
  option.series = chartData.series.map(obj => ({
    ...serieObj,
    ...obj
  })) as RadarSeriesOption[];
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

const getRadarFromDataset = (
  names: string[],
  rows: Array<number[]>
): RadarComponentOption => {
  let indicator = [];
  if (rows.length > 1) {
    indicator = names.map((key, idx) => {
      let data = rows.map((row: number[]) => row[idx]);
      return {
        name: key,
        max: Math.ceil(Math.max(...data)) * 1.1
      };
    });
  } else {
    const maxValue = Math.ceil(Math.max(...rows[0])) * 1.1;
    indicator = names.map(key => {
      return {
        name: key,
        max: maxValue
      };
    });
  }
  return { indicator: indicator, shape: 'circle' };
};

export const radarChart = {
  option: { ...radarOption },
  getOptionByData,
  labelFormat,
  getOptionByChartdataset
};
