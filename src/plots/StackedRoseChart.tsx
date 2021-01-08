import 'react';
import warn from 'warning';
import get from '@antv/util/lib/get';
import set from '@antv/util/lib/set';
import { Rose, RoseOptions as options } from '@antv/g2plot/lib/plots/rose';
import createPlot, { BasePlotOptions } from '../createPlot';
import { polyfillOptions, replaceApi } from './core/polyfill';
import { LengendAPIOptions, TooltipAPIOptions, LabelAPIOptions } from './core/interface';

const REPLACEAPILIST = [{
  sourceKey: 'stackField',
  targetKey: 'seriesField',
  notice: 'stackField 是 g2@1.0的属性，即将废弃，请使用seriesField替代',
}, {
  sourceKey: 'categoryField',
  targetKey: 'xField',
  notice: 'categoryField 是 g2@1.0的属性，即将废弃，请使用xField替代',
}, {
  sourceKey: 'radiusField',
  targetKey: 'yField',
  notice: 'radiusField 是 g2@1.0的属性，即将废弃，请使用yFeild替代',
}];

interface StackedRoseOptions extends options, BasePlotOptions {
  /** 请使用seriesField替代 */
  stackField?: string;
  /** 请使用xField替代 */
  categoryField?: string;
  /** 请使用yFeild替代 */
  radiusField?: string;
  legend?: LengendAPIOptions;
  tooltip?: TooltipAPIOptions;
  label?: LabelAPIOptions;
}

const polyfill = (opt: StackedRoseOptions): StackedRoseOptions => {
  warn(true, '<StackedRoseChart /> 即将在4.2.0后废弃，请使用<RoseChart />替代，文档查看：')

  const options = polyfillOptions(opt);
  replaceApi(REPLACEAPILIST, options);

  if (get(options, 'tooltip.visible') === false) {
    set(options, 'tooltip', false);
  }

  if (get(options, 'label.visible') === false) {
    set(options, 'label', false);
  }

  return { ...options, isStack: true };
}

export { StackedRoseOptions };

export default createPlot<StackedRoseOptions>(Rose, 'StackedRoseChart', polyfill);
