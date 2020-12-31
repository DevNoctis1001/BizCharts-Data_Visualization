import Area from '@antv/g2/lib/geometry/area';
import BaseGemo, { IBaseGemoProps } from './Base';
import { registerGeometry } from '../core';

registerGeometry('Area', Area);

import '@antv/g2/lib/geometry/shape/area/line';
import '@antv/g2/lib/geometry/shape/area/smooth';
import '@antv/g2/lib/geometry/shape/area/smooth-line';

export interface IAreaGemoProps extends IBaseGemoProps {}

export default class AreaGeom extends BaseGemo<IAreaGemoProps> {
  GemoBaseClassName = 'area'
}
