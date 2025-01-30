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
function PriceChart({ apartment, type, dateRange, onDataUpdate }) {
  const [loading, setLoading] = useState(false);
  /** @type {[ChartDataType[], React.Dispatch<React.SetStateAction<ChartDataType[]>>]} */
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    /**
     * 차트 데이터를 가져오는 함수
     * @returns {Promise<void>}
     */
    const fetchData = async () => {
      if (apartment?.complexNo && type && dateRange?.[0] && dateRange?.[1]) {
        setLoading(true);
        try {
          /** @type {import('../types/api').PriceChartResponse} */
          const response = await fetchPriceChartData(
            apartment.complexNo,
            type,
            dateRange[0].format('YYYYMMDD'),
            dateRange[1].format('YYYYMMDD')
          );
          
          const formattedData = response.dataBody.data.시세.flatMap(yearData => 
            yearData.items.map(item => ({
              date: dayjs(item.기준년월, 'YYYYMM').format('YYYY-MM-DD'),
              매매가: item.매매일반거래가,
              전세가: item.전세일반거래가
            }))
          );
          
          setChartData(formattedData);
          onDataUpdate(formattedData);
        } catch (error) {
          console.error('Error fetching chart data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [apartment, type, dateRange, onDataUpdate]);

  return (
    // <Card title="가격 추이">
    <Card>
      {loading ? (
        <div style={{ title: '가격 추이', textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : chartData.length > 0 ? (
        <div style={{ title: '가격 추이', width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
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