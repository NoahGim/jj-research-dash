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
  const [dateRange, setDateRange] = useState([dayjs().subtract(1, 'year'), dayjs()]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);

  // 차트 데이터 fetch 함수
  const fetchChartData = useCallback(async () => {
    if (!selectedApartment?.complexNo || !selectedType || !dateRange?.[0] || !dateRange?.[1]) return;
    
    setLoading(true);
    try {
      const response = await fetchPriceChartData(
        selectedApartment.complexNo,
        selectedType,
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
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedApartment, selectedType, dateRange]);

  // 데이터 fetch 실행
  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const handleApartmentSelect = useCallback((apartment) => {
    setSelectedApartment(apartment);
    setSelectedType(null);
  }, []);

  const handleTypeSelect = useCallback((type) => {
    setSelectedType(type);
  }, []);

  const handleDateChange = useCallback((dates) => {
    setDateRange(dates);
  }, []);

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
              type={selectedType}
              dateRange={dateRange}
            />
          </ControlPanel>
          <div className="chart-container">
            <PriceChart 
              loading={loading}
              data={chartData}
            />
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
