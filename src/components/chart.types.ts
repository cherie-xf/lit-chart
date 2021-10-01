import { EChartOption } from 'echarts';


export interface ChartData<Series> {
  series: Array<Series[]>;
  legend?: EChartOption.Legend;
  xAxis?: EChartOption.XAxis;
  yAxis?: EChartOption.YAxis;
  visualMap?: Array<EChartOption.VisualMap>;
}
export interface Radar {
  indicator: Array<radarIndicator>;
  shape?: string;
}

export type radarIndicator = {
  name: string;
  max: number;
};
export type ChartDataset = EChartOption.Dataset | EChartOption.Dataset[];

export interface SeriesPieExtend extends EChartOption.SeriesPie {
  width?: string | number;
  left?: string | number;
}
export interface ChartOption extends EChartOption {
  notMerge?: boolean;
}