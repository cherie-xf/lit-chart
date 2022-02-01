# lit-chart

The simplest and useful Web Component for DataSource based ECharts(5.0.0^) [Apache Echarts](https://github.com/apache/echarts)
### Introduce

- Components are built with [LitElement](https://lit-element.polymer-project.org/)
- Code bunlder and dev server are provided by [Vite](https://vitejs.dev/guide/)

### Install

Once you've cloned the repo, run the following command.

```bash
npm install @cherie-xf/lit-chart
```

## Useage Examples

### Simple Examples
It's recommended to use dataset to brings convenience in data management separated with styles and enabq data reuse by different series types.
```html preview
<nw-chart id="line-chart"></nw-chart>
<script>
  let type = 'line';
  let theme = 'dark';
  const dataset = {
    source: [
      ['users', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'],
      ['user1', 120, 132, 101, 134, 90, 230, 210],
      ['user2', 220, 182, 191, 234, 290, 330, 310],
      ['user3', 150, 232, 201, 154, 190, 330, 410],
      ['user4', 320, 332, 301, 334, 390, 330, 320],
      ['user5', 820, 932, 901, 934, 1290, 1330, 1320]
    ]
  };
  const dom = document.querySelector('#line-chart');
  dom.type = type;
  dom.theme = theme;
  dom.chartDataset = dataset;
  dom.seriesLayoutBy = 'row';
</script>
<style>
  #line-chart{
    width: 100%;
    height: 400px;
  }
</style>
```
Trantional way to set data in option
```html preview
<nw-chart id="line-chart-style"></nw-chart>
<script>
  let type = 'line';
  let theme = 'dark';
  const chartData = {
    xAxis: {
      data: [...Array(31).keys()]
    },
    series:  [{
        name: "number of views",
        type: "line",
        itemStyle: {
            color: "#6f7de3",
        },
        markPoint: {
            label: {
                      color: '#fff'
            },
            data: [{
                type: 'max',

            }, {
                type: 'min',
            }]
        },
        data: [
            509, 917, 2455, 2610, 2719, 3033, 3044, 3085, 2708, 2809, 2117,2000,1455,1210,719,
            733,944,2285,2208,3372,3936,3693,2962,2810,3519,2455,2610,2719,2484,2078
        ],
    }, {
        name: "number of order",
        type: "line",
        itemStyle: {
            color: "#c257F6",
        },
        markPoint: {
            label: {
                  color: '#fff'
            },
            data: [{
                type: 'max',

            }, {
                type: 'min',
            }]
        },
        data: [
            2136,3693,2962,3810,3519,3484,3915,3823,3455,4310,4019,3433,3544,3885,4208,3372,
            3484,3915,3748,3675,4009,4433,3544,3285,4208,3372,3484,3915,3823,4265,4298
        ]
    }, ]
  }
  const dom = document.querySelector('#line-chart-style');
  dom.type = type;
  dom.theme = theme;
  dom.chartData = chartData;
</script>
<style>
  #line-chart-style{
    width: 100%;
    height: 400px;
  }
</style>
```
Show No Data

```html preview
<nw-button id="no-data-button"> Click to toggle show No Data</nw-button>
<nw-chart id="no-data-chart"></nw-chart>
<script>
  let noData = false;
  const dataset = {
    source: [
        ['app','sessions'],
        ['Video/Audio',	1103],
        ['General.Interest',	839],
        ['Web.Client',	140],
        ['Collaboration',	298],
        ['Update',	1099],
        ['Web.Others',	97],
        ['Social.Media',	1474],]
  };
  const dom = document.querySelector('#no-data-chart');
  dom.type = 'donut';
  dom.chartDataset = dataset;
  const sumNum = dataset.source.slice(1).reduce((val, row) => val += Number(row[1]), 0)
  const titleText = 'Sessions by Applications'
  dom.legendFormat = '{percent} {name} ({value|number})';
  dom.pieTitle = {
    text: '{a|' + sumNum + '}\n{b|' + titleText + '}',
    textStyle: {
      rich: {
          a: {
              fontSize: 18,
              color: '#999',
              fontWeight: '600',
          },
          b: {
              fontSize: 10,
              color: '#999',
              padding: [5, 0]
          }
      }
    }
  }
  const onDataBtn = document.querySelector('#no-data-button');
  onDataBtn.addEventListener('click', (e) => {console.log(e)
    noData = !noData;
    dom.noData = noData;
    if(!noData){
      dom.chartDataset = Object.assign({}, dataset);
    }
  });
</script>
<style>
  #no-data-chart{
    width: 100%;
    height: 400px;
  }
</style>
```
Bar chart Horizontal

```html preview
<nw-button id="horizontal-button"> Click to toggle horizontal</nw-button>
<nw-chart id="bar-horizontal-chart"></nw-chart>
<script>
  const dataset = {
        source: [
            ['product','score'],
            ['Matcha Latte',89.3 ],
            ['Milk Tea',57.1 ],
            ['Cheese Cocoa',74.4 ],
            ['Cheese Brownie',50.1 ],
            ['Matcha Cocoa',89.7 ],
            ['Tea',68.1 ],
            ['Orange Juice',19.6 ],
            ['Lemon Juice',10.6 ],
            ['Walnut Brownie',32.7 ]
        ]
  };
  const dom = document.querySelector('#bar-horizontal-chart');
  const horizontalBtn = document.querySelector('#horizontal-button');
  let isHorizontal = true;
  horizontalBtn.addEventListener('click', (e) => {console.log(e)
    isHorizontal = !isHorizontal;
    dom.barHorizontal = isHorizontal;
  });
  dom.barHorizontal = isHorizontal;
  dom.type = 'bar';
  dom.chartDataset = dataset;
</script>
<style>
  #bar-horizontal-chart{
    width: 100%;
    height: 400px;
  }
</style>
```
Lenged Format

```html preview
<nw-chart id="legend-format-chart"></nw-chart>
<script>
  const dataset = {
    source: [
        ['app','bandwidth'],
        ['Video/Audio',	4369853248],
        ['General.Interest',	320065743],
        ['Web.Client',	296712124],
        ['Collaboration',	121727840],
        ['Update',	120717549],
        ['Web.Others',	119950230],
        ['Social.Media',	104562104],
        ['Storage.Backup',	69489727],
        ['Email',	67417552],
        ['Network.Service',	47828200],
        ['Proxy',	32291625],
        ['Business',	3926503],
        ['Botnet',	2048437],
        ['Remote.Access',	1937289],
        ['Cloud.IT',	910802],
        ['VoIP',	103774]]
  };
  const dom = document.querySelector('#legend-format-chart');
  dom.type = 'donut';
  dom.chartDataset = dataset;
  dom.legendFormat = '{percent} {name} ({value|bytes})';
</script>
<style>
  #legend-format-chart{
    width: 100%;
    height: 400px;
  }
</style>
```
Label Format

```html preview
<nw-chart id="label-format-chart"></nw-chart>
<script>
  const dataset = {
    source: [
        ['app','bandwidth'],
        ['Video/Audio',	4369853248],
        ['General.Interest',	320065743],
        ['Web.Client',	296712124],
        ['Collaboration',	121727840],
        ['Update',	120717549],
        ['Web.Others',	119950230],
        ['Social.Media',	104562104],
        ['Storage.Backup',	69489727],
        ['Email',	67417552],
        ['Network.Service',	47828200],
        ['Proxy',	32291625],
        ['Business',	3926503],
        ['Botnet',	2048437],
        ['Remote.Access',	1937289],
        ['Cloud.IT',	910802],
        ['VoIP',	103774]]
  };
  const dom = document.querySelector('#label-format-chart');
  dom.type = 'bar';
  dom.barHorizontal = false;
  dom.chartDataset = dataset;
  dom.axisLabelFormat = 'bytes';
</script>
<style>
  #label-format-chart{
    width: 100%;
    height: 400px;
  }
</style>
```
Pie Centre Title

```html preview
<nw-chart id="pie-title-chart"></nw-chart>
<script>
  const dataset = {
    source: [
        ['app','sessions'],
        ['Video/Audio',	1103],
        ['General.Interest',	839],
        ['Web.Client',	140],
        ['Collaboration',	298],
        ['Update',	1099],
        ['Web.Others',	97],
        ['Social.Media',	1474],]
  };
  const dom = document.querySelector('#pie-title-chart');
  dom.type = 'donut';
  dom.chartDataset = dataset;
  const sumNum = dataset.source.slice(1).reduce((val, row) => val += Number(row[1]), 0)
  const titleText = 'Sessions by Applications'
  dom.legendFormat = '{percent} {name} ({value|number})';
  dom.pieTitle = {
    text: '{a|' + sumNum + '}\n{b|' + titleText + '}',
    textStyle: {
      rich: {
          a: {
              fontSize: 18,
              color: '#999',
              fontWeight: '600',
          },
          b: {
              fontSize: 10,
              color: '#999',
              padding: [5, 0]
          }
      }
    }
  }
</script>
<style>
  #pie-title-chart{
    width: 100%;
    height: 400px;
  }
</style>
```
Two Directions Line Chart

```html preview
<nw-chart id="two-driections-line-chart"></nw-chart>
<script>
  const dataset = {
    source: [
      ['hodex',	'traffic_out',	'traffic_in'],
      ['2021-08-04 12:00',	882631069,	2409598028],
      ['2021-08-05 12:00',	599132216,	2034742409],
      ['2021-08-05 13:00',	1013432572,	2412315785],
      ['2021-08-05 15:00',	323660103,	1465572402],
      ['2021-08-05 16:00',	1107409869,	2343007502],
      ['2021-08-07 17:00',	596405933,	2020447260],
      ['2021-08-07 18:00',	1016775704,	2428736055],
    ]
  };
  const dom = document.querySelector('#two-driections-line-chart');
  dom.type = 'twoDirectionsArea';
  dom.chartDataset = dataset;
  dom.axisLabelFormat= 'bytes';
</script>
<style>
  #two-driections-line-chart{
    width: 100%;
    height: 400px;
  }
</style>
```
Heatmap Chart

```html preview
<nw-chart id="heatmap-chart"></nw-chart>
<script>
  const dataset = {
    source:[
      ['Day', 'City', 'Number'],
      ['Mon', 'BeiJing', 1000],
      ['Mon', 'HangZhou', 700],
      ['Tue', 'ChengDu', 500],
      ['Tue', 'ShenZheng', 200],
      ['Tue', 'ShangHai', 400],
      ['Wen', 'ChangChun', 100],
      ['Wen', 'HangZhou', 800],
      ['Wen', 'ShangHai', 300],
      ['Thu', 'ChengDu', 800],
      ['Fri', 'NaiJing', 300],
    ]
  };
  const dom = document.querySelector('#heatmap-chart');
  dom.type = 'heatmap';
  dom.chartDataset = dataset;
  const valArr = dataset.source.slice(1).map(arr=>arr[2]);
  const max = Math.max.apply(null, valArr);
  dom.visualMap= {
    min: 0,
    max: max,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '2%'
  };
</script>
<style>
  #heatmap-chart{
    width: 100%;
    height: 400px;
  }
</style>
```
Radar Chart

```html preview
<nw-chart id="radar-chart"></nw-chart>
<script>
  const dataset = {
    source:[
      ['name','Sales', 'Administration', 'Information Technology', 'Customer Support', 'Development', 'Marketing'],
      ['Allocated Budget',4200,3000,20000, 35000, 50000, 18000],
      ['Actual Spending',5000,1400, 28000, 26000, 42000, 21000],
    ]
  };
  const dom = document.querySelector('#radar-chart');
  dom.type = 'radar';
  dom.chartDataset = dataset;
  dom.labelFormat = 'bignumber'
</script>
<style>
  #radar-chart{
    width: 100%;
    height: 400px;
  }
</style>
```
Sankey Chart

```html preview
<nw-chart id="sankey-chart"></nw-chart>
<script>
  const dataset = {
    source: [
      ['summary', 'appcat', 'app_group', 'bandwidth'],
      ['External', 'unscanned', 'HTTPS', '13348980042'],
      ['External', 'Video%2FAudio', 'YouTube', '8876117511'],
      ['External', 'unscanned', 'DNS', '2194491065'],
      ['External', 'unscanned', 'HTTP', '1800715704'],
      ['External', 'unscanned', 'RSH', '674078138'],
      ['External', 'Web.Client', 'HTTP.BROWSER', '476648745'],
      ['External', 'General.Interest', 'Google.Services', '230378445'],
      ['External', 'General.Interest', 'Google.Maps', '190646528'],
      ['External', 'unscanned', 'SYSLOG', '170477268'],
      ['External', 'General.Interest', 'Google.Accounts', '139881690'],
      ['External', 'Web.Client', 'HTTPS.BROWSER', '132308701'],
      ['External', 'Video%2FAudio', 'Vimeo', '128472913'],
      ['External', 'unscanned', 'FTP', '124228574'],
      ['External', 'General.Interest', 'Google.Ads', '70378911'],
      ['External', 'General.Interest', 'Google.Search', '24753216'],
      ['External', 'unscanned', 'tcp%2F873', '18698936'],
      ['External', 'unscanned', 'TELNET', '12393826'],
    ]
  };
  const dom = document.querySelector('#sankey-chart');
  dom.type = 'sankey';
  dom.chartDataset = dataset;
  dom.labelFormat = 'bytes'
</script>
<style>
  #sankey-chart{
    width: 100%;
    height: 400px;
  }
</style>
```

### Complex Examples
Draw a simple chart by just given type and aync loading data
```html preview
<nw-button id="data-button"> Click to load data</nw-button>
<nw-button id="theme-button"> Click to toggle theme</nw-button>
<div class="type-selector">
  <span>Select chart type:</span>
  <nw-dropdown id="type-dropdown">
    <nw-button slot="trigger" caret><span>line</span></nw-button>
    <nw-menu>
      <nw-menu-item value="line">line</nw-menu-item>
      <nw-menu-item value="bar">bar</nw-menu-item>
      <nw-menu-item value="pie">pie</nw-menu-item>
      <nw-menu-item value="donut">donut</nw-menu-item>
    </nw-menu>
  </nw-dropdown>
</div>

<nw-chart id="my-chart"></nw-chart>
<script>
  let type = 'line';
  let theme = 'dark';
  const dataset = {
    source: [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1]
    ]
  };
  const dom = document.querySelector('#my-chart');
  const databtn = document.querySelector('#data-button');
  const themebtn = document.querySelector('#theme-button');
  const typedropdown = document.querySelector('#type-dropdown');
  dom.type = type;
  dom.theme = theme;
  databtn.addEventListener('click', (e) => {console.log(e)
    dom.chartDataset = dataset;
  });
  themebtn.addEventListener('click', (e) => {console.log(e)
    theme = theme ==='light' ? 'dark' : 'light';
    dom.theme = theme;
  });
  typedropdown.addEventListener('nwSelect', (e) => {console.log(e)
    type = e.detail.item.value;
    dom.type = type;
    let triggerDom = typedropdown.querySelector('[slot="trigger"]')
    triggerDom.innerText = e.detail.item.value
  });
</script>
<style>
  #my-chart{
    width: 100%;
    height: 400px;
  }
  .type-selector {
    margin-left: 20px;
    display: inline;
  }
</style>
```
### Events & Action Examples
Below displays how to highlight each sector of pie chart in turn through dispatchAction
```html preview
<nw-chart id="my-chart2"></nw-chart>
<script>
  let type = 'pie';
  let theme = 'dark';
  let app = {
    currentIndex: -1
  };
  const dataset = {
    source: [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1]
    ]
  };
  const dom = document.querySelector('#my-chart2');
  dom.type = type;
  dom.theme = theme;
  dom.chartDataset = dataset;
  setInterval(function () {
    var dataLen = dataset.source.length;
    dom.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: app.currentIndex
    });
    app.currentIndex = (app.currentIndex + 1) % dataLen;
    dom.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: app.currentIndex
    });
    dom.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: app.currentIndex
    });
}, 1000);

</script>
<style>
  #my-chart2{
    width: 100%;
    height: 400px;
  }
  .type-selector {
    margin-left: 20px;
    display: inline;
  }
</style>
```