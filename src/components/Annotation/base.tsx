import React from 'react';
import * as _ from '@antv/util';
import { ChartViewContext } from '../../hooks/useChartView';

export interface IAnnotationBaseProps {
  chartIns?: any;
  [key: string]: any;
}

// 4.0之后称为Annotation，为了名字统一
abstract class Annotation<PropsI extends IAnnotationBaseProps> extends React.Component<PropsI, any> {
  protected annotation: any;
  protected id: string;
  protected annotationType: string = 'line'; // 默认为line类型的guide
  protected index: number;

  componentDidMount() {
    const chartIns = this.getChartIns();
    console.log(chartIns);
    this.id = _.uniqueId('annotation');
    this.annotation = chartIns.annotation();
    this.annotation[this.annotationType](this.props);
    this.annotation.option[this.annotation.option.length - 1].__id = this.id;
  }
  componentDidUpdate() {
    let index = null;
    this.annotation.option.forEach((item, i) => {
      if (item.__id === this.id) {
        index = i;
      }
    });
    this.annotation.option[index] = { type: this.annotationType, ...this.props, __id: this.id };
    // fixme: 需要判断view的情况
    this.getChartIns().repaint();
  }
  componentWillUnmount() {
    let index = null;
    if (!this.annotation) {
      return;
    }
    this.annotation.options.forEach((item, i) => {
      if (item.__id === this.id) {
        index = i;
      }
    });
    if (index !== null) {
      this.annotation.options.splice(index, 1);
    }
    this.annotation = null;
  }
  getChartIns() {
    return this.context;
  }
  render() {
    return null;
  }
}

Annotation.contextType = ChartViewContext;

export default Annotation;
