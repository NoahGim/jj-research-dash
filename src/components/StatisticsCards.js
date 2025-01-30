import React, { useEffect, useState, useCallback } from 'react';
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
function StatisticsCards({ loading, data }) {
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

  const calculateStats = useCallback(() => {
    if (!data?.length) return null;

    return {
      avgSalePrice: calculateAverage(data.map(item => item.매매가)),
      avgJeonsePrice: calculateAverage(data.map(item => item.전세가)),
      maxSalePrice: Math.max(...data.map(item => item.매매가)),
      minSalePrice: Math.min(...data.map(item => item.매매가)),
      jeonseRatio: calculateJeonseRatio(data)
    };
  }, [data]);

  const stats = calculateStats();

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