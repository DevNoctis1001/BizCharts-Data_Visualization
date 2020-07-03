import React from 'react';
import forIn from '@antv/util/lib/for-in';
import isFunction from '@antv/util/lib/is-function';
import debounce from '@antv/util/lib/debounce';
import { IGroup } from '@antv/g-canvas';
import { IGroup as ISVGGroup } from '@antv/g-svg';
import uniqId from '@antv/util/lib/unique-id';
import GroupContext, { withGroupContext } from '../context/group';
import { EVENTS } from './Base/events';
import isArray from '@antv/util/lib/is-array';

export interface IGroupProps extends React.Props<any>{
  [key: string]: any;
}

class Group extends React.Component<any> {
  state={
    isReady: false,
  }
  private id: string;
  protected instance: IGroup | ISVGGroup;
  static defaultProps = {
    zIndex: 3,
  }
  constructor(props) {
    super(props);
    const { group, zIndex, name, rotate, animate } = props;
    this.id = uniqId('group')
    if (group.isChartCanvas) {
      group.chart.on('afterrender', this.handleRender);
    } else {
      this.instance = group.addGroup({ zIndex, name });
      this.configGroup(props);
    }
  }
  public getInstance() {
    return this.instance;
  }
  configGroup = (props) => {
    const { rotate, animate, rotateAtPoint, scale, translate, move } = props;
    if (rotate) {
      this.instance.rotate(rotate);
    }
    if (isArray(rotateAtPoint)) {
      // @ts-ignore
      this.instance.rotateAtPoint(...rotateAtPoint);
    }
    if (scale) {
      this.instance.rotate(scale);
    }
    if (translate) {
      this.instance.rotate(translate);
    }
    if (move) {
      this.instance.move(move.x, move.y);
    }
    if (animate) {
      const { toAttrs, ...animateCfg } = animate;
      this.instance.animate(toAttrs, animateCfg);
    }
  }
  bindEvents = () => {
    this.instance.off();
    forIn(EVENTS, (v, k) => {
      if (isFunction(this.props[k])) {
        this.instance.on(v, this.props[k]);
      }
    });
  }
  handleRender = debounce(() => {
    if (!this.instance) {
      const { group, zIndex, name } = this.props;
      this.instance = group.chart.canvas.addGroup({ zIndex, name });
      group.chart.canvas.sort();
      this.setState({ isReady: true })
    } else {
      this.forceUpdate();
    }
  }, 300)
  componentWillUnmount() {
    const { group } = this.props;
    if (group.isChartCanvas) {
      group.chart.off('afterrender', this.handleRender)
    }
    this.instance.remove(true);
  }
  render() {
    const { group } = this.props;
    if (this.instance) {
      this.instance.clear();
      this.bindEvents();
    }

    return (group.isChartCanvas && this.state.isReady) || (!group.isChartCanvas) 
      ? <GroupContext.Provider value={this.instance}>
        <React.Fragment key={uniqId(this.id)}>
          {this.props.children}
        </React.Fragment>
      </GroupContext.Provider> : <></>;
  }
}


export default withGroupContext<IGroupProps>(Group);
