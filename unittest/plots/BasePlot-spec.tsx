import React, { useEffect, useState } from 'react';
import AreaChart from '../../src/plots/AreaChart';
import Effects from '../../src/components/Effects';
import { render, act, cleanup } from '@testing-library/react';
// import { toMatchDiffSnapshot } from 'snapshot-diff';

// @ts-ignore
// global.expect.extend({ toMatchDiffSnapshot });

const MOCK_DATA = [{
  "Date": "2010-01",
  "scales": 1998
},
{
  "Date": "2010-02",
  "scales": 1250
},
{
  "Date": "2010-03",
  "scales": 1720
}];

const Chart = (props) => {
  const [data, setData] = useState([]);
  const option = {
    xField: 'Date',
    yField: 'scales',
    height: 400,
    forceFit: true,
    title: {
      visible: true,
      text: '折线图',
    },
    description: '兼容旧版本有description的功能',
    xAxis: {
      range: [0, 1],
      tickCount: 5,
    },
    ...props,
  };
  useEffect(() => {
    act(() => setData(MOCK_DATA));
  }, [])
  return <AreaChart data={data} {...option} >
    {props.children}
    </AreaChart>
}

describe('基础功能-以AreaChart为demo', () => {
  let chart = null;
  const { container } = render(<Chart onGetG2Instance={c => {
    chart = c;
  }} />);

  test('数据更新[] --> [{},{},{}]', () => {
    expect(chart.options.data.length).toBe(3);
    cleanup();
  });

  test('title、 description 高度计算和dom渲染', () => {
    // 图表高度
    expect(chart.options.height).toBe(336);
    // dom 快照
    expect(container).toMatchSnapshot();
    cleanup();
  });

  test('ErrorBoundary', () => {
    const { container } = render(<Chart>
      <Effects>
      {
        () => {throw new Error("test");}
      }
      </Effects>
    </Chart>);
    expect(container).toMatchSnapshot();
    cleanup();
  });

  test('自定义 ErrorBoundary', () => {
    const { container } = render(<Chart errorContent={<div>自定义 ErrorBoundary</div>}>
      <Effects>
      {
        () => {throw new Error("test");}
      }
      </Effects>
    </Chart>);
    expect(container).toMatchSnapshot();
    cleanup();
  });

  test('placeholder', () => {
    const { container } = render(<Chart placeholder data={undefined} />);
    expect(container).toMatchSnapshot();
    cleanup();
  });

  test('自定义 placeholder', () => {
    const { container } = render(<Chart placeholder="自定义 placeholder" data={undefined} />);
    expect(container).toMatchSnapshot();
    cleanup();
  });

  test('forceFit --> autoFit', () => {
    render(<Chart placeholder="自定义 placeholder" data={undefined} />);
    expect(chart.options.autoFit).toBe(true);
    cleanup();
  });
});


