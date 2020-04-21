import React from 'react';
import ErrorBoundary from '../../boundary/ErrorBoundary';
import withContainer from '../../boundary/withContainer';
import { Chart as _Chart } from '../../core';
import RootChartContext from '../../context/root';
import warn from '../../utils/warning';
import uniqueId from '@antv/util/lib/unique-id';

import View, { IView } from '../View';

export interface IChart extends IView {
  container?: HTMLElement;
  height?: number | string;
}

class Chart extends View<IChart> {
  static defaultProps = {
    placeholder: <div style={{ position: 'relative', top: '48%', textAlign: 'center' }}>暂无数据</div>,
    visible: true,
  }
  ChartBaseClass: any = _Chart;
  initInstance() {
    this.id = uniqueId(this.name);
    const options = this.getInitalConfig();
    this.g2Instance = new this.ChartBaseClass(options);
    if (options.pure) {
      this.g2Instance.axis(false);
      this.g2Instance.tooltip(false);
    } else {
      this.g2Instance.tooltip({ showMarkers: false });
    }
  }
  getInitalConfig() {
    // const { container } = this.props;
    // TODO: 排除事件&生命周期勾子属性；
    const config = { ...this.props };
    if (config.forceFit !== undefined) {
      warn(false, 'forceFit 将会在4.1后不再支持，请使用`autoFit`替代');
      config.autoFit = config.forceFit;
    }

    return config;
  }

  componentDidMount() {
    if (!this.g2Instance) {
      return;
    }
    super.componentDidMount();
    if (this.g2Instance) {
      this.g2Instance.render();
    }
  }

  componentDidUpdate(perProps) {
    if (!this.g2Instance) {
      return;
    }
    this.configInstance(perProps, this.props);
    this.g2Instance.render();
  }

  componentWillUnmount() {
    this.destroy();
  }

  destroy() {
    if (this.g2Instance) {
      this.g2Instance.destroy();
      this.g2Instance = null;
    }
  }

  render() {
    if (this.props.data === undefined) {
      this.destroy();
      return <ErrorBoundary>
        {this.props.placeholder}
      </ErrorBoundary>
    }
    this.getInstance();
    return (
      <ErrorBoundary>
        <RootChartContext.Provider value={{ chart: this.g2Instance }}>
          {super.render()}
        </RootChartContext.Provider>
      </ErrorBoundary>
    );
  }
}

export default withContainer<IChart>(Chart);
