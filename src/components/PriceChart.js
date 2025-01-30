import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchPriceChartData } from '../services/api';
import dayjs from 'dayjs';

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
  return (
    <Card>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : data?.length > 0 ? (
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                type="category"
                label={{ value: '날짜', position: 'left' }}
              />
              <YAxis 
                label={{ 
                  value: '가격 (억)', 
                  angle: -90, 
                  position: 'insideLeft'
                }}
                tickFormatter={(value) => (value / 10000).toFixed(2)}
              />
              <Tooltip />
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
              />
              <Line 
                type="monotone" 
                dataKey="전세가" 
                stroke="#82ca9d" 
                name="전세가"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          데이터를 선택해주세요
        </div>
      )}
    </Card>
  );
}

export default PriceChart; 