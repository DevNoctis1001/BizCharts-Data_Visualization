import uniqueId from '@antv/util/lib/unique-id';
import GeometryLabel from '@antv/g2/esm/geometry/label/base';
import Base, { IBaseProps } from '../Base';
import { ChartViewContext } from '../hooks/useChartView';

import { registerGeometryLabel } from '../core';

import compareProps from '../utils/compareProps';

// 交互事件
import './actions';

registerGeometryLabel('base', GeometryLabel);

export interface IBaseGemo extends IBaseProps {}

export default abstract class BaseGeom<T> extends Base<T> {
  name = 'gemo';
  ChartBaseClass = null;
  protected interactionTyps: string[] = [];
  protected abstract readonly GemoBaseClassName: string;
  getInitalConfig() {
    return undefined;
  }
  initInstance() {
    const chart = this.context;
    this.id = uniqueId(this.name);
    const options = this.getInitalConfig();
    this.g2Instance = chart[this.GemoBaseClassName](options);
  }
  configInstance(preProps, curProps) {
    super.configInstance(preProps, curProps);
    const nextProps = this.props;
    compareProps(
      preProps,
      nextProps,
      ['position', 'shape', 'adjust', 'color', 'label', 'style'],
      (value, key) => {
        // console.log('position', value);
        console.log(key, value);
        this.g2Instance[key](...value);
      },
    );
    // interaction
    compareProps(preProps, nextProps, this.interactionTyps, (value, key) => {
      // console.log('position', value);
      if (value[0]) {
        this.context.interaction(key);
      } else {
        // unSave: g2-innerAPI
        this.context.interactions[key].destory();
      }
    });
  }
  configInteraction() {}
}

BaseGeom.contextType = ChartViewContext;
