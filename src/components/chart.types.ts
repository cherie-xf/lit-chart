import {
  EChartsOption,
  YAXisComponentOption,
  XAXisComponentOption,
  LegendComponentOption,
  VisualMapComponentOption,
  DatasetComponentOption,
  PieSeriesOption,
  SeriesOption,
  GridComponentOption,
  TooltipComponentOption,
  RadarComponentOption
} from 'echarts';

export interface ChartData<SeriesOption> {
  series: Array<SeriesOption[]>;
  legend?: LegendComponentOption;
  xAxis?: XAXisComponentOption;
  yAxis?: YAXisComponentOption;
  visualMap?: VisualMapComponentOption;
}
// export interface Radar {
//   indicator: Array<radarIndicator>;
//   shape?: string;
// }

// export type radarIndicator = {
//   name: string;
//   max: number;
// };
export type ChartDataset = DatasetComponentOption | DatasetComponentOption[];

export interface SeriesPieExtend extends PieSeriesOption {
  width?: string | number;
  left?: string | number;
}
export interface ChartOption extends EChartsOption {
  notMerge?: boolean;
}

// export interface ChartTypeOption
//   extends Pick<EChartsOption, 'grid| tooltip| xAxis | yAxis | legend'> {
//   series: SeriesOption[];
// }

export interface ChartTypeOption {
  grid?: GridComponentOption | GridComponentOption[];
  tooltip?: TooltipComponentOption;
  legend?: LegendComponentOption;
  xAxis?: XAXisComponentOption | XAXisComponentOption[];
  yAxis?: YAXisComponentOption | YAXisComponentOption[];
  series?: SeriesOption[];
  visualMap?: VisualMapComponentOption[];
  radar?: RadarComponentOption;
  animation?: boolean;
}

export interface CallbackDataParams {
  componentType: string;
  componentSubType: string;
  componentIndex: number;
  seriesType?: string;
  seriesIndex?: number;
  seriesId?: string;
  seriesName?: string;
  name: string;
  dataIndex: number;
  data: any;
  dataType?: any;
  value: any;
  color?: any;
  borderColor?: string;
  dimensionNames?: any[];
  encode?: any;
  marker?: any;
  status?: any;
  dimensionIndex?: number;
  percent?: number;
  $vars: string[];
}
