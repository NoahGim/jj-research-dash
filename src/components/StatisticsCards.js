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

  const calculateAverages = useCallback(() => {
    if (!data?.length) return null;

    // 유효한 데이터만 필터링하는 함수
    const filterValidData = (items, key) => {
      return items.filter(item => 
        item[key] !== undefined && 
        item[key] !== null && 
        !isNaN(item[key]) && 
        item[key] > 0
      );
    };

    // 전세가율 계산 함수
    const calculateJeonseRatio = (priceData) => {
      const validData = priceData.filter(item => 
        item.매매가 !== undefined && 
        item.매매가 !== null && 
        !isNaN(item.매매가) && 
        item.매매가 > 0 &&
        item.전세가 !== undefined && 
        item.전세가 !== null && 
        !isNaN(item.전세가) && 
        item.전세가 > 0
      );

      if (validData.length === 0) return 0;

      const ratios = validData.map(item => (item.전세가 / item.매매가) * 100);
      return calculateAverage(ratios);
    };

    // 유효한 데이터만 필터링
    const validSaleData = filterValidData(data, '매매가');
    const validJeonseData = filterValidData(data, '전세가');

    return {
      avgSalePrice: validSaleData.length > 0 ? calculateAverage(validSaleData.map(item => item.매매가)) : 0,
      avgJeonsePrice: validJeonseData.length > 0 ? calculateAverage(validJeonseData.map(item => item.전세가)) : 0,
      maxSalePrice: validSaleData.length > 0 ? Math.max(...validSaleData.map(item => item.매매가)) : 0,
      minSalePrice: validSaleData.length > 0 ? Math.min(...validSaleData.map(item => item.매매가)) : 0,
      jeonseRatio: calculateJeonseRatio(data)
    };
  }, [data]);

  const stats = calculateAverages();

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