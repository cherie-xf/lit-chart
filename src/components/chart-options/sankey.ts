import {
  DatasetComponentOption,
  EChartsOption,
  LabelFormatterCallback,
  SankeySeriesOption
} from 'echarts';
import { ChartData, ChartTypeOption, CallbackDataParams } from '../chart.types';
import { getFormattedValue } from '../helper';
// import { getColorsByNumber } from '../../echarts-base/echarts-themes/themes.js';
const sankeyOption: ChartTypeOption = {
  tooltip: {
    trigger: 'item'
  },
  animation: false,
  series: [
    {
      type: 'sankey',
      data: [],
      links: []
    }
  ]
};

const getOptionByData = (
  chartData: ChartData<SankeySeriesOption>
): EChartsOption => {
  let option = { ...sankeyOption };
  let serieObj = option.series ? option.series[0] : {};
  option.series = chartData.series.map(obj => ({
    ...serieObj,
    ...obj
  })) as SankeySeriesOption[];
  return option;
};

const labelFormat = (
  formatter: string
): LabelFormatterCallback<CallbackDataParams> | string | undefined => {
  return function (params: any): string {
    const value = getFormattedValue(params.value, formatter);
    return `${params.name}: ${value}`;
  };
};

const getOptionByChartdataset = (
  dataset: DatasetComponentOption,
  // theme = 'light',
  labelFormatter: string = 'default'
): ChartTypeOption => {
  let option = { ...sankeyOption };
  let source = dataset.source as Array<Array<any>>;
  if (Array.isArray(source) && source.length) {
    const cols: Array<string> = source.slice(0, 1)[0] as string[];
    if (cols.length > 1) {
      const fields: Array<string> = cols.slice(0, -1);
      const valueFrom: string = cols[cols.length - 1];
      const links = fields.reduce(
        (arr: Record<string, string>[], field, idx) => {
          if (fields[idx + 1]) {
            arr = [...arr, { source: field, target: fields[idx + 1] }];
          }
          return arr;
        },
        []
      );
      const rows = source.slice(1).map(row => {
        return row.reduce(
          (obj: Record<string, string>, value: string, idx: number) => ({
            ...obj,
            [cols[idx]]: value
          }),
          {}
        );
      });
      const nodes: Record<string, []> = fields.reduce((res, nodeName) => {
        return {
          ...res,
          [nodeName]: Array.from(
            new Set(rows.map(row => row[nodeName]).filter(d => d))
          )
        };
      }, {});

      let seriesNode = Object.keys(nodes).reduce(
        (acc: Array<any>, field: string) => {
          let subNodes = nodes[field].map(value => {
            let oData = rows.filter(d => d[field] === value);
            return {
              name: value,
              field: field,
              oData: oData,
              value: valueFrom
                ? oData.reduce((res, row) => (res += Number(row[valueFrom])), 0)
                : undefined
            };
          });
          return [...acc, ...subNodes];
        },
        []
      );
      // const colors = getColorsByNumber(seriesNode.length, theme);
      const colors = [
        '#5470c6',
        '#91cc75',
        '#fac858',
        '#ee6666',
        '#73c0de',
        '#3ba272',
        '#fc8452',
        '#9a60b4',
        '#ea7ccc'
      ];
      if (colors?.length && colors.length > seriesNode?.length) {
        seriesNode = seriesNode.map((obj, idx) => ({
          ...obj,
          itemStyle: {
            color: colors[idx]
          }
        }));
      }

      const valLinks = links.reduce((acc: Array<any>, link) => {
        const sources = nodes[link.source];
        const targets = nodes[link.target];
        const linkArray = sources.reduce((res: Array<any>, value) => {
          const array = Array(targets.length).fill({
            key: link.source,
            value: value
          });
          const crossArr = array.map((obj, index) => [
            obj,
            { key: link.target, value: targets[index] }
          ]);
          return [...res, ...crossArr];
        }, []);
        return [...acc, ...linkArray];
      }, []);

      let seriesLinks = valLinks
        .map(link => {
          let sourceKey = link[0].key;
          let sourceVal = link[0].value;
          let targetKey = link[1].key;
          let targetVal = link[1].value;
          let matchArr = rows.filter(
            d =>
              d[sourceKey] &&
              d[sourceKey] === sourceVal &&
              d[targetKey] &&
              d[targetKey] === targetVal
          );
          return {
            source: sourceVal,
            target: targetVal,
            value: valueFrom
              ? matchArr.reduce((res, d) => (res += Number(d[valueFrom])), 0)
              : matchArr.length,
            oData: matchArr
          };
        })
        .filter(obj => obj.value > 0);
      option.series = [
        {
          type: 'sankey',
          data: seriesNode,
          links: seriesLinks,
          label: {
            show: true,
            formatter: labelFormat(labelFormatter)
          }
        }
      ];
    }
  }
  return option;
};

export const sankeyChart = {
  option: { ...sankeyOption },
  getOptionByData,
  getOptionByChartdataset,
  labelFormat
};
