import {
  LitElement,
  html,
  css,
  customElement,
  query,
  property,
  PropertyValues
} from 'lit-element';
import '@cherie-xf/lit-echarts';
import {
  lineChart,
  areaChart,
  barChart,
  pieChart,
  donutChart,
  scatterChart,
  heatmapChart,
  radarChart,
  twoDirectionsLine,
  twoDirectionsArea,
  sankeyChart
} from './chart-options';
import {
  DatasetComponentOption,
  EChartsOption,
  RadarComponentOption,
  SeriesOption,
  TitleComponentOption,
  VisualMapComponentOption,
  XAXisComponentOption,
  YAXisComponentOption
} from 'echarts';
import * as echarts from 'echarts';
import isEqual from 'fast-deep-equal';
import { ChartData, ChartOption } from './chart.types';

@customElement('lit-chart')
export default class LitChart extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .chart {
      width: 100%;
      height: 100%;
    }
  `;
  @query('[part="base"]') base: HTMLElement;
  /** Theme to be */
  @property({ type: String, reflect: true }) theme = undefined;
  /** Chart type, series.type eg: 'line', 'pie'*/
  @property({ type: String, reflect: true }) type: string | undefined =
    undefined; // default chart type is line
  /** When dataset is used, seriesLayoutBy specifies whether the column or the row of dataset is mapped to the series, namely, the series is "layout" on columns or rows */
  @property({ type: String, reflect: true }) seriesLayoutBy = 'column'; // 'column' | 'row'
  /** Configuration item and data. Please refer to [configuration item manual](https://echarts.apache.org/en/option.html#title) for more information */
  @property({ type: Object, reflect: true }) option = {} as ChartOption;
  /** For preset option configuration item and data. Please refer to [configuration item manual](https://echarts.apache.org/en/option.html#title) for more information */
  @property({ type: Object, reflect: true }) presetOpt = {} as EChartsOption;
  /** Source data. Generally speaking, a source data describe a table, where these format below can be applied: 2d array, where dimension names can be provided in the first row/column, or do not provide, only data */
  @property({ reflect: true }) chartDataset: DatasetComponentOption | undefined;
  /** Chart Data for traditional how to set data source, before EChart4, data was declared in each series
   *  If chartDataset is set, chartData will be ignored.
   *  If you want carrying style in data, you can chose this way
   */
  @property({ type: Object, reflect: true }) chartData:
    | ChartData<SeriesOption>
    | undefined;
  /** Shows loading animation, If set false after previous true value, will hide current loading animation*/
  @property({ type: Boolean, reflect: true }) showLoading: boolean | string =
    false;
  /** Shows No Data and stop loading animation*/
  @property({ type: Boolean, reflect: true }) noData = false;
  /** Initialize chart Instance chart configurationsLines in loaded buffers. Please refer to [configuration details](https://echarts.apache.org/en/api.html#echarts.init)*/
  @property({ type: Object, reflect: true }) opts = {};
  @property({ reflect: true }) onChartReady:
    | ((o: echarts.ECharts) => void)
    | undefined;
  /** Call back function after chart init return with echarts instance, you can get echarts public api through this instance, like: "getOption"*/
  @property({ type: Object, reflect: true }) onEvents = {};
  @property({ reflect: true }) chart: echarts.ECharts | undefined;
  /** is bar chart horizontal*/
  @property({ type: Boolean, reflect: true }) barHorizontal = false;
  /** pie chart center title*/
  @property({ type: Boolean, reflect: true }) pieTitle = {};
  /** lenged format string, e.g. '{percent} {name} ({value|bytes})' */
  @property({ type: String, reflect: true }) legendFormat = '';
  /** axisLabel format string, e.g. 'percent' */
  @property({ type: String, reflect: true }) axisLabelFormat = '';
  /** series label format string, e.g. 'percent' */
  @property({ type: String, reflect: true }) labelFormat = '';
  /** visualMap is a type of component for visual encoding */
  @property({ reflect: true }) visualMap: VisualMapComponentOption | undefined;
  /** Coordinate for radar charts */
  @property({ reflect: true }) radar: RadarComponentOption | undefined;

  firstUpdated() {
    // backward compatibility
    // no type setting will use given option
    if (this.type) {
      this.option = this.getChartOption(this.type);
      if (this.option.series && this.seriesLayoutBy) {
        this.option.series = this.updateSeriesLayout(
          this.option.series,
          this.seriesLayoutBy
        );
      }
    }
    this.showLoading = true;
    this.onChartReady = (o: echarts.ECharts) => {
      this.chart = o;
    };
  }

  private updateSeriesLayout(
    series: SeriesOption | SeriesOption[],
    layoutBy: string
  ) {
    if (Array.isArray(series)) {
      return series.map(obj => ({
        ...obj,
        seriesLayoutBy: layoutBy
      })) as SeriesOption[];
    }
    return series;
  }
  private multiplySeriesByData(
    series: Array<SeriesOption> | SeriesOption,
    // source: Array<any[]>,
    source: any,
    layoutBy: string
  ) {
    if (Array.isArray(series)) {
      let obj = series[0];
      let num = layoutBy === 'row' ? source.length - 1 : source[0].length - 1;
      let resArr = [];
      if (num > 0) {
        for (let i = 0; i < num; i++) {
          resArr.push(obj);
        }
      }
      return resArr;
    }
    return series;
  }

  private handleLineOnePoint(
    series: SeriesOption[] | SeriesOption,
    sourceLength: number
  ) {
    if (Array.isArray(series)) {
      return series.map(obj => {
        if (obj.type === 'line') {
          return {
            ...obj,
            showSymbol: sourceLength === 2 ? true : false,
            symbolSize: 8
          };
        }
        return obj;
      });
    }
    return series;
  }

  updated(properties: PropertyValues) {
    if (
      this.type &&
      properties.has('type') &&
      properties.get('type') !== this.type
    ) {
      const chartOption = this.getChartOption(this.type);
      this.option = Object.keys(this.presetOpt).length
        ? { ...chartOption, ...this.presetOpt }
        : chartOption;
      if (this.option.series && this.seriesLayoutBy) {
        this.option.series = this.updateSeriesLayout(
          this.option.series,
          this.seriesLayoutBy
        );
      }
      if (this.chartDataset) {
        let source = this.chartDataset.source;
        if (
          this.option.series &&
          source &&
          Array.isArray(source) &&
          source.length
        ) {
          if (
            ![
              'twoDirectionsLine',
              'twoDirectionsArea',
              'radar',
              'sankey'
            ].includes(this.type)
          ) {
            this.option.series = this.multiplySeriesByData(
              this.option.series,
              source,
              this.seriesLayoutBy
            );
          }
          this.option.series = this.handleLineOnePoint(
            this.option.series,
            source.length
          );
        }
        this.option.dataset = this.chartDataset;
        this.noData =
          source && Array.isArray(source) && source.length ? false : true;
      } else if (this.chartData) {
        this.option = this.getOptionByData(this.type)(this.chartData);
        this.showLoading = false;
      }
      // default notMerge is set to true, if want to merge with old option, need manually set to false
      this.option.notMerge = true;
    }

    if (
      this.chartDataset &&
      properties.has('chartDataset') &&
      !isEqual(properties.get('chartDataset'), this.chartDataset)
    ) {
      let source = this.chartDataset.source;
      this.showLoading = false;
      this.noData =
        source && Array.isArray(source) && source.length ? false : true;
      if (this.noData) {
        this.option.dataset = this.chartDataset;
        return;
      } else if (
        this.type &&
        this.option.series &&
        source &&
        Array.isArray(source) &&
        source.length
      ) {
        if (
          ![
            'twoDirectionsLine',
            'twoDirectionsArea',
            'radar',
            'sankey'
          ].includes(this.type)
        ) {
          this.option.series = this.multiplySeriesByData(
            this.option.series,
            source,
            this.seriesLayoutBy
          );
        }
        this.option.series = this.handleLineOnePoint(
          this.option.series,
          source.length
        );
      }
      let ov = { ...this.option, dataset: this.chartDataset };
      if (this.type === 'sankey' || this.type === 'radar') {
        ov = this.getOptionByChartdataset(this.type)(
          this.chartDataset,
          this.theme,
          this.labelFormat
        );
      }
      this.option = Object.assign({}, ov);
    }
    if (
      this.type &&
      this.chartData &&
      !this.chartDataset &&
      properties.has('chartData') &&
      !isEqual(properties.get('chartData'), this.chartData)
    ) {
      this.option = this.getOptionByData(this.type)(this.chartData);
      this.showLoading = false;
    }
    if (
      this.type === 'bar' &&
      properties.has('barHorizontal') &&
      properties.get('barHorizontal') !== undefined &&
      this.barHorizontal !== properties.get('barHorizontal')
    ) {
      // const xAxis = { ...this.option.xAxis };
      // const yAxis = { ...this.option.yAxis };
      // const ov = { ...this.option, xAxis: yAxis, yAxis: xAxis };
      const xAxis = { ...this.option.xAxis } as XAXisComponentOption;
      const yAxis = { ...this.option.yAxis } as YAXisComponentOption;
      const nRotate = this.barHorizontal ? 0 : 15;
      const nX = yAxis.axisLabel
        ? { ...yAxis, axisLabel: { ...yAxis.axisLabel, rotate: nRotate } }
        : (yAxis as YAXisComponentOption);
      const nY = xAxis.axisLabel
        ? { ...xAxis, axisLabel: { ...xAxis.axisLabel, rotate: nRotate } }
        : (xAxis as XAXisComponentOption);
      const ov = { ...this.option, xAxis: nX, yAxis: nY } as ChartOption;
      this.option = Object.assign({}, ov);
    }
    if (
      properties.has('pieTitle') &&
      (this.type === 'pie' || this.type === 'donut') &&
      !isEqual(properties.get('pieTitle'), this.pieTitle)
    ) {
      const ov = {
        ...this.option,
        title: {
          ...this.pieTitle,
          ...pieChart.pieTitleCommon
        } as TitleComponentOption
      };
      this.option = Object.assign({}, ov);
    }
    if (
      this.type &&
      this.legendFormat &&
      (properties.has('type') ||
        properties.has('legendFormat') ||
        properties.has('chartDataset'))
    ) {
      let source = this.chartDataset?.source;
      if (source && Array.isArray(source) && source.length) {
        const handle = this.getLegendFormatter(this.type);
        const legendFormatter = handle
          ? handle(this.legendFormat, this.chartDataset, this.seriesLayoutBy)
          : undefined;
        const ov = {
          ...this.option,
          legend: { ...this.option.legend, formatter: legendFormatter }
        };
        this.option = Object.assign({}, ov);
      }
    }
    if (
      this.type &&
      this.axisLabelFormat &&
      (properties.has('axisLabelFormat') || properties.has('type'))
    ) {
      const formatterStrArr = this.axisLabelFormat.split('|');
      const handle = this.getAxisLabelFormatter(this.type);
      let ov = { ...this.option };
      if (
        ['twoDirectionsLine', 'twoDirectionsArea'].includes(this.type) &&
        formatterStrArr.length > 1 &&
        Array.isArray(ov.yAxis)
      ) {
        const labelFormatters = formatterStrArr.map(str => handle(str));
        ov.yAxis = ov.yAxis.map((obj, idx) => {
          return { ...obj, axisLabel: { formatter: labelFormatters[idx] } };
        }) as YAXisComponentOption;
      } else {
        const labelFormatter = handle
          ? handle(this.axisLabelFormat)
          : undefined;
        if (Array.isArray(ov.yAxis) && !ov.yAxis.some(obj => obj.type)) {
          ov.yAxis = ov.yAxis.map(obj => {
            return Object.keys(obj).includes('type')
              ? obj
              : { ...obj, axisLabel: { formatter: labelFormatter } };
          }) as YAXisComponentOption;
        } else if (Array.isArray(ov.xAxis) && !ov.xAxis.some(obj => obj.type)) {
          ov.xAxis = ov.xAxis.map(obj => {
            return Object.keys(obj).includes('type')
              ? obj
              : { ...obj, axisLabel: { formatter: labelFormatter } };
          }) as XAXisComponentOption;
        } else if (
          typeof ov.yAxis === 'object' &&
          !Object.keys(ov.yAxis).includes('type')
        ) {
          ov.yAxis = {
            ...ov.yAxis,
            axisLabel: { formatter: labelFormatter }
          } as YAXisComponentOption;
        } else if (
          typeof this.option.xAxis === 'object' &&
          !Object.keys(this.option.xAxis).includes('type')
        ) {
          ov.xAxis = {
            ...ov.xAxis,
            axisLabel: { formatter: labelFormatter }
          } as XAXisComponentOption;
        }
      }
      this.option = Object.assign({}, ov);
    }
    if (
      this.type &&
      this.labelFormat &&
      (properties.has('labelFormat') || properties.has('type'))
    ) {
      const handle = this.getLabelFormatter(this.type);
      const labelFormatter = handle ? handle(this.labelFormat) : undefined;
      let ov = { ...this.option };
      if (ov.series && Array.isArray(ov.series)) {
        ov.series = ov.series.map(serie => {
          return { ...serie, label: { show: true, formatter: labelFormatter } };
        });
      }
      this.option = Object.assign({}, ov);
    }
    if (
      properties.has('presetOpt') &&
      Object.keys(this.presetOpt).length &&
      !isEqual(properties.get('presetOpt'), this.presetOpt)
    ) {
      this.option = Object.assign({}, { ...this.option, ...this.presetOpt });
    }
    if (
      properties.has('visualMap') &&
      this.visualMap &&
      Object.keys(this.visualMap).length &&
      !isEqual(properties.get('visualMap'), this.visualMap)
    ) {
      if (this.option.visualMap) {
        this.option = Object.assign(
          {},
          {
            ...this.option,
            visualMap: { ...this.option.visualMap, ...this.visualMap }
          }
        );
      }
    }
    if (
      properties.has('radar') &&
      this.radar &&
      Object.keys(this.radar).length &&
      !isEqual(properties.get('radar'), this.radar) &&
      this.type === 'radar'
    ) {
      if (this.option.radar) {
        this.option = Object.assign(
          {},
          { ...this.option, radar: { ...this.option.radar, ...this.radar } }
        );
      }
    }
  }

  render() {
    return html` <lit-echarts
      part="base"
      .theme="${this.theme}"
      .option="${this.option}"
      .opts="${this.opts}"
      .onEvents="${this.onEvents}"
      .showLoading="${this.showLoading}"
      .noData="${this.noData}"
      .onChartReady="${this.onChartReady}"
    >
    </lit-echarts>`;
  }
  private getChartOption = (type: string): EChartsOption => {
    const typeToOption: Record<string, EChartsOption> = {
      line: lineChart.option,
      area: areaChart.option,
      bar: barChart.option,
      pie: pieChart.option,
      donut: donutChart.option,
      scatter: scatterChart.option,
      heatmap: heatmapChart.option,
      radar: radarChart.option,
      sankey: sankeyChart.option,
      twoDirectionsLine: twoDirectionsLine.option,
      twoDirectionsArea: twoDirectionsArea.option
    };
    return { ...typeToOption[type] };
  };
  private getOptionByData = (
    type: string
  ): ((chartData: ChartData<any>) => EChartsOption) => {
    const handles: Record<
      string,
      (chartData: ChartData<any>) => EChartsOption
    > = {
      line: lineChart.getOptionByData,
      area: areaChart.getOptionByData,
      bar: barChart.getOptionByData,
      pie: pieChart.getOptionByData,
      donut: donutChart.getOptionByData,
      scatter: scatterChart.getOptionByData,
      heatmap: heatmapChart.getOptionByData,
      radar: radarChart.getOptionByData,
      sankey: sankeyChart.getOptionByData,
      twoDirectionsLine: twoDirectionsLine.getOptionByData,
      twoDirectionsArea: twoDirectionsArea.getOptionByData
    };
    return handles[type];
  };
  private getLegendFormatter = (type: string): Function => {
    const handles: Record<string, Function> = {
      pie: pieChart.legendFormatter,
      donut: pieChart.legendFormatter
    };
    return handles[type];
  };
  private getAxisLabelFormatter = (type: string): Function => {
    const handles: Record<string, Function> = {
      bar: barChart.axisLabelFormat,
      line: lineChart.axisLabelFormat,
      area: areaChart.axisLabelFormat,
      twoDirectionsLine: twoDirectionsLine.axisLabelFormat,
      twoDirectionsArea: twoDirectionsArea.axisLabelFormat
    };
    return handles[type];
  };
  private getLabelFormatter = (type: string): Function => {
    const handles: Record<string, Function> = {
      bar: barChart.labelFormat,
      line: lineChart.labelFormat,
      radar: radarChart.labelFormat,
      sankey: sankeyChart.labelFormat
    };
    return handles[type];
  };
  private getOptionByChartdataset = (type: string): Function => {
    const handles: Record<string, Function> = {
      sankey: sankeyChart.getOptionByChartdataset,
      radar: radarChart.getOptionByChartdataset
    };
    return handles[type];
  };
}
declare global {
  interface HTMLElementTagNameMap {
    litChart: LitChart;
  }
}
