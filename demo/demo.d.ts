import { LitElement } from 'lit-element';
import '..src';
import { EChartOption } from 'echarts';
export default class LitChartDemo extends LitElement {
    static styles: import("lit-element").CSSResult;
    chartDataset: EChartOption.Dataset | undefined;
    type: string | undefined;
    render(): import("lit-element").TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'lit-chart-demo': LitChartDemo;
    }
}
