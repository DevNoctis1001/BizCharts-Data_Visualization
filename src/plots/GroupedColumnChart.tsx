import 'react';
import { Column, ColumnOptions } from '@antv/g2plot/lib/plots/column';
import createPlot, { BasePlotOptions } from '../createPlot';
import { polyfillOptions, replaceApi } from './core/polyfill';
import { LengendAPIOptions, TooltipAPIOptions, LabelAPIOptions } from './core/interface';
import { isNil } from '@antv/util';
import warn from 'warning';

interface GroupedColumnOptions extends ColumnOptions, BasePlotOptions {
  legend?: LengendAPIOptions;
  tooltip?: TooltipAPIOptions;
  label?: LabelAPIOptions;
  /** 柱子的宽度，如设置该属性值，则宽度固定不自动调整 */
  columnSize?: number;
}
export { GroupedColumnOptions };
export default createPlot<GroupedColumnOptions>(Column, 'GroupedColumnChart', (props) => {
  warn(true, '<GroupedColumnChart /> 在4.2.0后即将被废弃，请使用<ColumnChart /> 替代');
  const { columnSize, ...options } = polyfillOptions(props);
  if (!isNil(columnSize)) {
    options.minColumnWidth = columnSize;
    options.maxColumnWidth = columnSize;
  }
  return options;
});
