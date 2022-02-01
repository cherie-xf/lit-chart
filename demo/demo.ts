import { customElement, LitElement, css, html, property } from 'lit-element';
// import '..src';
import '../index';
import { DatasetComponentOption, EChartsOption } from 'echarts';

@customElement('lit-chart-demo')
export default class LitChartDemo extends LitElement {
  static styles = css`
    :host {
      margin: 20px auto;
      display: block;
    }
    .my-chart {
      width: 800px;
      height: 400px;
    }
    lit-echarts {
      width: 100%;
      height: 100%;
    }
    button {
      cursor: pointer;
    }
  `;
  @property({ reflect: true }) chartDataset: DatasetComponentOption | undefined;
  @property({ type: String, reflect: true }) type: string | undefined; // default chart type is line
  render() {
    this.type = 'line';
    this.chartDataset = {
      source: [
        ['users', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'],
        ['user1', 120, 132, 101, 134, 90, 230, 210],
        ['user2', 220, 182, 191, 234, 290, 330, 310],
        ['user3', 150, 232, 201, 154, 190, 330, 410],
        ['user4', 320, 332, 301, 334, 390, 330, 320],
        ['user5', 820, 932, 901, 934, 1290, 1330, 1320]
      ]
    };

    return html`
      <lit-chart
        class="my-chart"
        .type=${this.type}
        .chartDataset=${this.chartDataset}
      ></lit-chart>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'lit-chart-demo': LitChartDemo;
  }
}
