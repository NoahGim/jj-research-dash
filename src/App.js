import React, { useState, useCallback } from 'react';
import { Layout, ConfigProvider } from 'antd';
import SearchBar from './components/SearchBar';
import TypeSelector from './components/TypeSelector';
import DateRangeSelector from './components/DateRangeSelector';
import PriceChart from './components/PriceChart';
import StatisticsCards from './components/StatisticsCards';
import ExcelExport from './components/ExcelExport';
import './styles/App.css';
import dayjs from 'dayjs';
import ko_KR from 'antd/es/locale/ko_KR';
import 'dayjs/locale/ko';
import 'antd/dist/reset.css';

const { Header, Content } = Layout;

// dayjs 로케일 설정
dayjs.locale('ko');

function App() {
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [dateRange, setDateRange] = useState([dayjs().subtract(1, 'year'), dayjs()]);
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState(null);

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

  const handleDataUpdate = useCallback((data) => {
    setPriceData(data);
  }, []);

  return (
    <ConfigProvider locale={ko_KR}>
      <Layout className="layout">
        <Header className="header">
          <h1>부동산 시세 분석</h1>
        </Header>
        <Content className="content">
          <div className="control-panel">
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
              priceData={priceData}
            />
          </div>
          <div className="chart-container">
            <PriceChart 
              apartment={selectedApartment}
              type={selectedType}
              dateRange={dateRange}
              onDataUpdate={handleDataUpdate}
            />
          </div>
          <div className="statistics-container">
            <StatisticsCards 
              apartment={selectedApartment}
              type={selectedType}
              dateRange={dateRange}
            />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
