import { EChartOption } from "echarts";
import { ChartData, radarIndicator, Radar } from "../chart.types";
import { getFormattedValue } from "../helper";
const radarOption: EChartOption<EChartOption.SeriesRadar> = {
  tooltip: {},
  legend: {
    type: "scroll",
    itemGap: 8,
    itemWidth: 16,
    itemHeight: 8
  },
  radar: {
    indicator: []
  },
  series: [
    {
      type: "radar",
      areaStyle: {
        opacity: 0.4
      }
    }
  ]
};

const getOptionByChartdataset = (
  dataset: EChartOption.Dataset
): EChartOption => {
  const source = dataset.source;
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
      });
    }
  }
  return option;
};

const getOptionByData = (
  chartData: ChartData<EChartOption.SeriesRadar>
): EChartOption => {
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

const getRadarFromDataset = (names: string[], rows: Array<number[]>): Radar => {
  let indicator: Array<radarIndicator> = [];
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
  return { indicator: indicator, shape: "circle" };
};

export default {
  option: { ...radarOption },
  getOptionByData,
  labelFormat,
  getOptionByChartdataset
};
