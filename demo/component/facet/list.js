import React,  { Component } from 'react';
import BizCharts from 'bizcharts';
import DataSet from '@antv/data-set';
import data from '../../data/diamond.json';

const { Chart, Geom, Facet, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } = BizCharts;
const { DataView } = DataSet;
const { Text } = Guide;

const scale = {
  carat: {
    sync: true
  },
  price: {
    sync: true,
    tickCount: 3
  },
  cut: {
    sync: true
  }
};


export default class List extends Component {
  
  render() {
    return (
      <Chart height={450} data={data} width={800} height={600} padding={[30, 80, 80, 80]} scale={scale}>
        <Legend />
        <Facet type='list' fields={['cut']} cols={3} padding={30} eachView={(view, facet)=>{
          view.point()
          .position('carat*price')
          .color('cut')
          .shape('circle')
          .opacity(0.3)
          .size(3); 
        }}>
        </Facet>
      </Chart>
    );
  }
}
