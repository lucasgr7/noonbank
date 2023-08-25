export interface Title {
  text: string;
}

export interface AxisPointerLabel {
  backgroundColor: string;
}

export interface AxisPointer {
  type: string;
  label: AxisPointerLabel;
}

export interface Tooltip {
  trigger: string;
  axisPointer: AxisPointer;
}

export interface Legend {
  data: string[];
}

export interface ToolboxFeature {
  saveAsImage: {};
}

export interface Toolbox {
  feature: ToolboxFeature;
}

export interface Grid {
  left: string;
  right: string;
  bottom: string;
  containLabel: boolean;
}

export interface XAxis {
  type: string;
  boundaryGap: false;
  data: string[];
}

export interface YAxis {
  type: string;
}

export interface SeriesLabel {
  show: boolean;
  position: string;
}

export interface SimpleSeries {
  name: string;
  type: string;
  data: number[];
}

export interface Series extends SimpleSeries{
  
  stack: string;
  areaStyle: Record<string, unknown>;
  emphasis: {
    focus: string;
  };
  label?: SeriesLabel;
}

export class ChartOptionsBuilder {
  options = {
    title: {
      text: '',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
    } as Legend,
    toolbox: {
    } as Toolbox,
    grid: {
    } as Grid,
    xAxis: [
    ] as XAxis[],
    yAxis: [
    ] as YAxis[],
    series: [] as Series[],
  };
  

  setTitle(title: string){
    this.options.title.text = title;
    return this;
  }
  setTooltip(trigger: string, axisPointer: AxisPointer){
    this.options.tooltip.trigger = trigger;
    this.options.tooltip.axisPointer = axisPointer;
    return this;
  }
  setLegend(data: string[]){
    this.options.legend.data = data;
    return this;
  }
  setToolbox(feature: ToolboxFeature){
    this.options.toolbox.feature = feature;
    return this;
  }
  setGrid(left: string, right: string, bottom: string){
    this.options.grid.left = left;
    this.options.grid.right = right;
    this.options.grid.bottom = bottom;
    this.options.grid.containLabel = true;
    return this;
  }
  setYAxis(axis: YAxis[]){
    this.options.yAxis = axis;
    return this;
  }
  setXAxis(axis: XAxis[]){
    this.options.xAxis = axis;
    return this;
  }
  setSeries(series: Series[]){
    this.options.series = series;
    return this;
  }
  build(){
    // log json version of options
    console.info(JSON.stringify(this.options));
    console.info(this.options);
    return this.options;
  }

  buildLineChartOptions(title: string,
    legend: string[],
    xAxis: XAxis[],
    series: SimpleSeries[])
    {
      const seriesAdjusted = series.map(s => {
        return {
          ...s,
          stack: 'total',
          label: {
            show: false,
            position: 'top',
          },
          areaStyle: {},
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' }
            ]
          },
          emphasis: {
            focus: 'series',
          },
        } as Series;
      });
      return this.setTitle(title)
        .setTooltip('axis', {type: 'cross', label: {backgroundColor: '#6a7985'}})
        .setLegend(legend)
        .setToolbox({saveAsImage: {}})
        .setGrid('3%', '4%', '3%')
        .setXAxis(xAxis)
          .setYAxis([{
            type: 'value',
        }])
        .setSeries(seriesAdjusted)
        .build();
    }
}