import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Spin } from 'antd';
import { fetchPriceChartData } from '../services/api';
// import dayjs from 'dayjs';

/**
 * @typedef {Object} Statistics
 * @property {number} avgSalePrice - 평균 매매가
 * @property {number} avgJeonsePrice - 평균 전세가
 * @property {number} maxSalePrice - 최고 매매가
 * @property {number} minSalePrice - 최저 매매가
 * @property {number} jeonseRatio - 전세가율
 */

/**
 * 통계 카드 컴포넌트
 * @param {Object} props
 * @param {Object} [props.apartment]
 * @param {string} props.apartment.complexNo - 단지번호
 * @param {string} [props.type] - 타입
 * @param {[import('dayjs').Dayjs, import('dayjs').Dayjs]} [props.dateRange] - 날짜 범위
 */
function StatisticsCards({ apartment, type, dateRange }) {
  const [loading, setLoading] = useState(false);
  /** @type {[Statistics | null, React.Dispatch<React.SetStateAction<Statistics | null>>]} */
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let mounted = true; // 컴포넌트 마운트 상태를 추적

    /**
     * 통계 데이터를 계산하는 함수
     * @returns {Promise<void>}
     */
    const calculateStats = async () => {
      if (apartment?.complexNo && type && dateRange?.[0] && dateRange?.[1]) {
        setLoading(true);
        try {
          /** @type {import('../types/api').ApartmentDetailsResponse} */
          const response = await fetchPriceChartData(
            apartment.complexNo,
            type,
            dateRange[0].format('YYYYMMDD'),
            dateRange[1].format('YYYYMMDD')
          );

          // 컴포넌트가 마운트된 상태일 때만 상태 업데이트
          if (mounted) {
            const allPrices = response.dataBody.data.시세.flatMap(yearData => 
              yearData.items.map(item => ({
                매매가: item.매매일반거래가,
                전세가: item.전세일반거래가
              }))
            );

            const stats = {
              avgSalePrice: calculateAverage(allPrices.map(item => item.매매가)),
              avgJeonsePrice: calculateAverage(allPrices.map(item => item.전세가)),
              maxSalePrice: Math.max(...allPrices.map(item => item.매매가)),
              minSalePrice: Math.min(...allPrices.map(item => item.매매가)),
              jeonseRatio: calculateJeonseRatio(allPrices)
            };
            
            setStats(stats);
          }
        } catch (error) {
          console.error('Error calculating statistics:', error);
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    };

    calculateStats();

    // cleanup 함수
    return () => {
      mounted = false; // 컴포넌트 언마운트 시 플래그를 false로 설정
    };
  }, [apartment, type, dateRange]);

  /**
   * 평균값을 계산하는 함수
   * @param {number[]} numbers - 계산할 숫자 배열
   * @returns {number} 평균값
   */
  const calculateAverage = (numbers) => {
    return numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;
  };

  /**
   * 전세가율을 계산하는 함수
   * @param {Array<{매매가: number, 전세가: number}>} data - 계산할 데이터
   * @returns {number} 평균 전세가율
   */
  const calculateJeonseRatio = (data) => {
    const ratios = data.map(item => (item.전세가 / item.매매가) * 100);
    return calculateAverage(ratios);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic
            title="평균 매매가"
            value={stats.avgSalePrice}
            precision={0}
            suffix="만원"
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="평균 전세가"
            value={stats.avgJeonsePrice}
            precision={0}
            suffix="만원"
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="평균 전세가율"
            value={stats.jeonseRatio}
            precision={1}
            suffix="%"
          />
        </Card>
      </Col>
    </Row>
  );
}

export default StatisticsCards; 