import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { fetchPriceChartData } from '../services/api';
// import PriceChart from './PriceChart';

const SearchContainer = styled.div`
  height: 60vh;
  background: linear-gradient(135deg, #4568dc, #b06ab3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;

const SearchTitle = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 600px;
  padding: 1.2rem 2rem;
  border-radius: 50px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    transform: scale(1.02);
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
  }
`;

const SearchSection = ({ dateRange: parentDateRange, onDateRangeChange, selectedType }) => {
  const [houseType, setHouseType] = useState(null);
  const [fullChartData, setFullChartData] = useState(null);
  const [displayChartData, setDisplayChartData] = useState(null);

  // 디버그 로그를 위한 유틸리티 함수
  const debug = (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  };

  // parentDateRange가 변경될 때 필터링
  useEffect(() => {
    if (!fullChartData || !parentDateRange[0] || !parentDateRange[1]) return;

    debug('SearchSection: 필터링 전 데이터:', fullChartData);
    debug('SearchSection: 현재 dateRange:', parentDateRange);

    const filteredData = fullChartData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= parentDateRange[0] && itemDate <= parentDateRange[1];
    });

    debug('SearchSection: 필터링된 데이터:', filteredData);
    setDisplayChartData(filteredData);
  }, [parentDateRange, fullChartData]);

  const handleHouseTypeChange = async (selectedType) => {
    setHouseType(selectedType);
    
    try {
      debug('선택된 주택 타입:', selectedType);
      const data = await fetchPriceChartData(selectedType);
      debug('받아온 차트 데이터:', data);
      
      if (!data || data.length === 0) {
        console.error('데이터가 비어있습니다');
        return;
      }

      const dates = data.map(item => new Date(item.date));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));
      
      debug('설정될 날짜 범위:', minDate, maxDate);
      onDateRangeChange([minDate, maxDate]);
      setFullChartData(data);
    } catch (error) {
      console.error('차트 데이터 로드 중 오류 발생:', error);
    }
  };

  return (
    <SearchContainer>
      {/* <PriceChart 
        data={displayChartData} 
        onHouseTypeChange={handleHouseTypeChange}
        onDateRangeChange={onDateRangeChange}
      /> */}
    </SearchContainer>
  );
};

export default SearchSection; 