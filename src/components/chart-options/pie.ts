import {
  DatasetComponentOption,
  EChartsOption,
  PieSeriesOption
} from 'echarts';
import { ChartData, ChartTypeOption } from '../chart.types';
import { getFormattedValue } from '../helper';
const pieOption: ChartTypeOption = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    right: 'right',
    itemGap: 8,
    itemWidth: 16,
    itemHeight: 8
  },
  series: [
    {
      type: 'pie',
      radius: '50%',
      center: ['50%', '50%'],
      width: '80%'
    }
  ]
};

const donutOption: ChartTypeOption = {
  ...pieOption,
  series: [
    {
      type: 'pie',
      radius: ['36%', '60%'],
      center: ['50%', '50%'],
      width: '80%'
    }
  ]
};

const getOptionByData =
  (opt: ChartTypeOption) =>
  (chartData: ChartData<PieSeriesOption>): EChartsOption => {
    let option = { ...opt };
    let serieObj = option.series ? option.series[0] : {};
    option.series = chartData.series.map(obj => ({
      ...serieObj,
      ...obj
    })) as PieSeriesOption[];
    if (chartData.legend) {
      option.legend = {
        ...option.legend,
        ...chartData.legend
      };
    }
    return option;
  };

/** legendFormatStr
 *  e.g.: '{percent} {name} ({value|bytes})'
 */
export const legendFormatter = (
  formatSrt: string,
  dataset: DatasetComponentOption,
  layoutBy: string
): Function => {
  const rg = /{(value[^}]*)}/g;
  const valRe = rg.exec(formatSrt);
  const valueArr = valRe?.length ? valRe[1]?.split('|') : [];
  const formatter = valueArr.length > 1 ? valueArr[1] : '';
  const source = dataset.source as Array<any>;
  return (name: string): string => {
    let values = Array<number>();
    let sum = 0;
    let val = 0;
    let percent = 0;
    let valStr = '';
    if (dataset.source && Array.isArray(dataset.source)) {
      if (
        layoutBy === 'row' &&
        Array.isArray(dataset.source[0]) &&
        dataset.source.length > 1
      ) {
        values = source[1].slice(1);
        let idx = dataset.source[0].findIndex(str => str === name);
        val = source[1][idx];
      } else if (Array.isArray(dataset.source[0])) {
        values = source
          .slice(1)
          .map(row => (row.length > 1 ? parseInt(row[1]) : 0));
        let row = source.find(row => row[0] === name);
        val = row.length > 1 ? row[1] : 0;
      }
      if (values?.length > 0) {
        sum = values.reduce((acc, val) => acc + val, 0);
        percent = sum && val ? Math.round((val / sum) * 100 * 100) / 100 : 0;
      }
      valStr = formatter ? getFormattedValue(val, formatter) : `${val}`;
    }
    return formatSrt.replace(/{([^}]+)}/g, function (_, b) {
      return b === 'name'
        ? `${name}`
        : b === 'percent'
        ? `${percent}%`
        : valStr;
    });
  };
};
const pieTitleCommon = {
  x: '40%',
  y: 'center',
  textAlign: 'center'
};

export const pieChart = {
  option: { ...pieOption },
  getOptionByData: getOptionByData({ ...pieOption }),
  legendFormatter,
  pieTitleCommon
};

export const donutChart = {
  option: { ...donutOption },
  getOptionByData: getOptionByData({ ...donutOption }),
  legendFormatter,
  pieTitleCommon
};
