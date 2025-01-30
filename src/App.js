import React, { useState, useCallback, useEffect } from 'react';
import { Layout, ConfigProvider } from 'antd';
import styled from 'styled-components';
import SearchBar from './components/SearchBar';
import TypeSelector from './components/TypeSelector';
import DateRangeSelector from './components/DateRangeSelector';
import PriceChart from './components/PriceChart';
import StatisticsCards from './components/StatisticsCards';
import ExcelExport from './components/ExcelExport';
import { fetchPriceChartData } from './services/api';
import './styles/App.css';
import dayjs from 'dayjs';
import ko_KR from 'antd/es/locale/ko_KR';
import 'dayjs/locale/ko';
import 'antd/dist/reset.css';

const { Header, Content } = Layout;

// dayjs 로케일 설정
dayjs.locale('ko');

// 중앙 정렬을 위한 스타일 컴포넌트 수정
const CenteredContent = styled(Content)`
  width: 100%;
  padding: 24px;
`;

const CenteredHeader = styled(Header)`
  text-align: center;
  width: 100%;
  
  h1 {
    color: white;
    margin: 0;
  }
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
`;

function App() {
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTypeInfo, setSelectedTypeInfo] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [fullChartData, setFullChartData] = useState(null);

  // 차트 데이터 fetch 함수
  const fetchChartData = useCallback(async () => {
    console.log('fetchChartData 실행:', { selectedApartment, selectedType });
    
    // 필수 데이터 체크
    if (!selectedApartment?.complexNo || !selectedType) {
      console.log('필수 데이터 없음');
      setChartData(null);
      setFullChartData(null);
      setDateRange(null);
      return;
    }
    
    setLoading(true);
    try {
      console.log('API 호출 시작');
      const response = await fetchPriceChartData(
        selectedApartment.complexNo,
        selectedType,
        '20000101',
        dayjs().format('YYYYMMDD')
      );
      
      console.log('API 응답:', response);
      
      const formattedData = response.dataBody.data.시세.flatMap(yearData => 
        yearData.items.map(item => ({
          date: dayjs(item.기준년월, 'YYYYMM').format('YYYY-MM-DD'),
          매매가: item.매매일반거래가,
          전세가: item.전세일반거래가
        }))
      ).sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());

      console.log('가공된 데이터:', formattedData);

      setFullChartData(formattedData);
      
      // dateRange가 없는 경우 (초기 로드 또는 리셋된 경우)
      if (!dateRange) {
        console.log('dateRange 설정');
        const dates = formattedData.map(item => dayjs(item.date));
        // dayjs.min 대신 직접 최소/최대 날짜 찾기
        const minDate = dates.reduce((min, curr) => 
          curr.isBefore(min) ? curr : min, dates[0]
        );
        const maxDate = dates.reduce((max, curr) => 
          curr.isAfter(max) ? curr : max, dates[0]
        );
        
        setDateRange([minDate, maxDate]);
        setChartData(formattedData);
      } else {
        console.log('데이터 필터링');
        const filteredData = formattedData.filter(item => {
          const itemDate = dayjs(item.date);
          return itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1]);
        });
        setChartData(filteredData);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setChartData(null);
      setFullChartData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedApartment, selectedType]);

  // 데이터 fetch 실행 - 이 useEffect는 더 이상 필요하지 않습니다
  // useEffect(() => {
  //   fetchChartData();
  // }, [fetchChartData]);

  // 아파트 선택 핸들러 수정
  const handleApartmentSelect = useCallback((apartment) => {
    setSelectedApartment(apartment);
    setSelectedType(null);  // 아파트가 변경되면 타입 초기화
    setChartData(null);    // 차트 데이터 초기화
    setFullChartData(null); // 전체 데이터 초기화
    setDateRange(null);    // 날짜 범위 초기화
  }, []);

  // 타입 선택 핸들러 수정
  const handleTypeSelect = useCallback((typeId, typeInfo) => {
    console.log('타입 선택:', typeId, typeInfo);
    if (typeId) {
      setSelectedType(typeId);
      setSelectedTypeInfo(typeInfo);
      setTimeout(() => {
        console.log('Delayed fetchChartData 호출, selectedType:', typeId);
        fetchChartData();
      }, 0);
    } else {
      setSelectedType(null);
      setSelectedTypeInfo(null);
      setChartData(null);
      setFullChartData(null);
      setDateRange(null);
    }
  }, [fetchChartData]);

  // 또는 useEffect를 사용하는 방법
  useEffect(() => {
    if (selectedType && selectedApartment) {
      console.log('useEffect에서 fetchChartData 호출');
      fetchChartData();
    }
  }, [selectedType, selectedApartment, fetchChartData]);

  const handleDateChange = useCallback((dates) => {
    setDateRange(dates);
    if (fullChartData && dates) {
      const filteredData = fullChartData.filter(item => {
        const itemDate = dayjs(item.date);
        return itemDate.isAfter(dates[0]) && itemDate.isBefore(dates[1]);
      });
      setChartData(filteredData);
    }
  }, [fullChartData]);

  return (
    <ConfigProvider locale={ko_KR}>
      <Layout className="layout">
        <CenteredHeader>
          <h1>JJ 리서치 [부동산 시세 분석]</h1>
        </CenteredHeader>
        <CenteredContent>
          <ControlPanel>
            <SearchBar 
              onSelect={handleApartmentSelect}
              loading={loading}
              setLoading={setLoading}
            />
            <TypeSelector 
              apartment={selectedApartment}
              onSelect={handleTypeSelect}
              selectedType={selectedType}
            />
            <DateRangeSelector 
              onDateChange={handleDateChange}
              dateRange={dateRange}
            />
            <ExcelExport 
              apartment={selectedApartment}
              type={selectedTypeInfo}
              dateRange={dateRange}
              priceData={chartData}
            />
          </ControlPanel>
          <div className="chart-container">
            <PriceChart 
              loading={loading}
              data={chartData}
            />
            {/* 디버깅용 데이터 상태 표시 */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{ display: 'none' }}>
                <p>Selected Type: {selectedType}</p>
                <p>Chart Data Length: {chartData?.length}</p>
                <p>Full Chart Data Length: {fullChartData?.length}</p>
                <p>Date Range: {dateRange?.map(d => d?.format('YYYY-MM-DD')).join(' ~ ')}</p>
              </div>
            )}
          </div>
          <div className="statistics-container">
            <StatisticsCards 
              loading={loading}
              data={chartData}
            />
          </div>
        </CenteredContent>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
