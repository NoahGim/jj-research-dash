import React, { useState, useEffect } from 'react';
import { Card, Spin, Button } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import dayjs from 'dayjs';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

/**
 * @typedef {Object} ChartDataType
 * @property {string} date - 날짜
 * @property {number} 매매가 - 매매가격
 * @property {number} 전세가 - 전세가격
 */

/**
 * @param {Object} props
 * @param {Object} [props.apartment]
 * @param {string} props.apartment.complexNo - 단지번호
 * @param {string} [props.type] - 타입
 * @param {[import('dayjs').Dayjs, import('dayjs').Dayjs]} [props.dateRange] - 날짜 범위
 * @param {(data: ChartDataType[]) => void} props.onDataUpdate - 데이터 업데이트 콜백
 */
function PriceChart({ loading, data }) {
  const [zoomState, setZoomState] = useState({
    left: null,
    right: null,
    refAreaLeft: '',
    refAreaRight: '',
    top: null,
    bottom: 0,
    animation: true,
    history: [],        // 줌 히스토리 저장
    historyIndex: -1    // 현재 히스토리 위치
  });

  // data가 변경될 때 히스토리 초기화
  useEffect(() => {
    setZoomState(prev => ({
      ...prev,
      left: null,
      right: null,
      refAreaLeft: '',
      refAreaRight: '',
      top: null,
      bottom: 0,
      history: [],
      historyIndex: -1
    }));
  }, [data]);

  // Y축 도메인 계산 함수 수정
  const getAxisYDomain = (from, to) => {
    const refData = data.slice(from, to + 1);
    const maxValue = Math.max(
      ...refData.map(d => Math.max(d['매매가'], d['전세가']))
    );
    
    // 위쪽 여백을 전체 범위의 10%로 설정
    const buffer = maxValue * 0.1;
    return [0, maxValue + buffer];
  };

  // 히스토리에 현재 상태 저장하는 함수
  const saveToHistory = (newState) => {
    const newHistory = zoomState.history.slice(0, zoomState.historyIndex + 1);
    newHistory.push({
      left: newState.left,
      right: newState.right,
      top: newState.top,
      bottom: newState.bottom
    });
    
    return {
      ...newState,
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  };

  // 뒤로 가기
  const handleUndo = () => {
    if (zoomState.historyIndex > 0) {
      const prevState = zoomState.history[zoomState.historyIndex - 1];
      setZoomState({
        ...zoomState,
        ...prevState,
        historyIndex: zoomState.historyIndex - 1
      });
    }
  };

  // 앞으로 가기
  const handleRedo = () => {
    if (zoomState.historyIndex < zoomState.history.length - 1) {
      const nextState = zoomState.history[zoomState.historyIndex + 1];
      setZoomState({
        ...zoomState,
        ...nextState,
        historyIndex: zoomState.historyIndex + 1
      });
    }
  };

  // zoom 함수 수정
  const zoom = () => {
    let { refAreaLeft, refAreaRight } = zoomState;
    
    if (refAreaLeft === refAreaRight || !refAreaRight) {
      setZoomState({
        ...zoomState,
        refAreaLeft: '',
        refAreaRight: ''
      });
      return;
    }

    if (refAreaLeft > refAreaRight) {
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
    }

    const leftIndex = data.findIndex(item => item.date === refAreaLeft);
    const rightIndex = data.findIndex(item => item.date === refAreaRight);
    const [bottom, top] = getAxisYDomain(leftIndex, rightIndex);

    const newState = {
      ...zoomState,
      refAreaLeft: '',
      refAreaRight: '',
      left: refAreaLeft,
      right: refAreaRight,
      bottom,
      top
    };

    setZoomState(saveToHistory(newState));
  };

  // zoomOut 함수 수정
  const zoomOut = () => {
    const newState = {
      ...zoomState,
      left: null,
      right: null,
      refAreaLeft: '',
      refAreaRight: '',
      top: null,
      bottom: 0
    };
    setZoomState(saveToHistory(newState));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0 }}>{`날짜: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              color: entry.color,
              margin: '5px 0 0 0'
            }}>
              {`${entry.name}: ${(entry.value / 10000).toFixed(2)}억`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // 필터링된 데이터를 변수로 추출
  const filteredData = data ? data.filter(item => 
    (!zoomState.left || item.date >= zoomState.left) && 
    (!zoomState.right || item.date <= zoomState.right)
  ) : [];

  return (
    <Card>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : data?.length > 0 ? (
        <>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart
                data={filteredData}
                onMouseDown={e => e && setZoomState({ ...zoomState, refAreaLeft: e.activeLabel })}
                onMouseMove={e => e && zoomState.refAreaLeft && setZoomState({ ...zoomState, refAreaRight: e.activeLabel })}
                onMouseUp={zoom}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  type="category"
                  allowDataOverflow={true}
                  domain={['auto', 'auto']}
                  scale="point"
                  interval="preserveEnd"
                  label={{ value: '날짜', position: 'bottom' }}
                  ticks={filteredData.map(item => item.date)}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tickFormatter={(value) => {
                    const date = dayjs(value);
                    const currentIndex = filteredData.findIndex(item => item.date === value);
                    const prevDate = currentIndex > 0 ? filteredData[currentIndex - 1].date : null;
                    
                    // 첫 데이터이거나 마지막 데이터이거나 연도가 바뀌는 경우에 연도를 포함
                    if (currentIndex === 0 || 
                        currentIndex === filteredData.length - 1 || 
                        (!prevDate || dayjs(prevDate).year() !== date.year())) {
                      return date.format('YYYY-MM');
                    }
                    return date.format('MM');
                  }}
                />
                <YAxis
                  domain={[
                    0,
                    dataMax => Math.ceil(dataMax * 1.1)  // 최대값에서 10% 더 여유 공간 추가
                  ]}
                  label={{
                    value: '가격 (억)',
                    angle: -90,
                    position: 'insideLeft'
                  }}
                  tickFormatter={(value) => (value / 10000).toFixed(2)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                />
                <Line
                  type="monotone"
                  dataKey="매매가"
                  stroke="#8884d8"
                  name="매매가"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="전세가"
                  stroke="#82ca9d"
                  name="전세가"
                  dot={false}
                  strokeWidth={2}
                />
                {zoomState.refAreaLeft && zoomState.refAreaRight ? (
                  <ReferenceArea
                    x1={zoomState.refAreaLeft}
                    x2={zoomState.refAreaRight}
                    strokeOpacity={0.3}
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                ) : null}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <Button 
              onClick={zoomOut}
              disabled={!zoomState.left && !zoomState.right}
              type="primary"
            >
              확대 초기화
            </Button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          데이터를 선택해주세요
        </div>
      )}
    </Card>
  );
}

export default PriceChart; 