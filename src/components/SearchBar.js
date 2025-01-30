import React, { useState } from 'react';
import { fetchSearchResults, fetchApartmentDetails } from '../services/api';
import { Input, List } from 'antd';
import styled from 'styled-components';

// 스크롤 가능한 리스트 컨테이너 스타일 추가
const ScrollableList = styled.div`
  max-height: 120px; // 3개의 아이템이 보이도록 설정
  overflow-y: auto;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin-top: 4px;
  
  // 스크롤바 스타일링
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

function SearchBar({ onSelect, loading, setLoading }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      console.log('Search query:', query);
      const response = await fetchSearchResults(query);
      console.log('Search response:', response);
      
      // response가 배열이므로 첫 번째 요소를 사용
      const searchData = response[0];
      // if (!searchData?.dataBody?.data) {
      //   console.log('No data found');
      //   setResults([]);
      //   return;
      // }

      const dataArray = searchData.COL_AT_HSCM;
      console.log('Data array:', dataArray);

      const formattedResults = dataArray
        .map(item => ({
          text: item.text,
          address: item.addr,
          displayName: item.textTemp
        }));
      
      console.log('Formatted results:', formattedResults);
      setResults(formattedResults);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (result) => {
    setLoading(true);
    try {
      const details = await fetchApartmentDetails(result.displayName);
      const complexData = details.dataBody.data.data.HSCM.data[0];
      onSelect({
        complexNo: complexData.COMPLEX_NO,
        apartmentName: complexData.HSCM_NM,
        address: complexData.BUBADDR,
      });
    } catch (error) {
      console.error('Error fetching apartment details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-bar">
      <Input.Search
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={handleSearch}
        placeholder="아파트 이름을 입력하세요"
        loading={loading}
        enterButton
      />
      {results.length > 0 && (
        <ScrollableList>
          <List
            size="small"
            dataSource={results}
            renderItem={(result) => (
              <List.Item 
                onClick={() => handleSelect(result)}
                style={{ 
                  cursor: 'pointer',
                  padding: '8px 12px',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                {result.displayName}
              </List.Item>
            )}
          />
        </ScrollableList>
      )}
    </div>
  );
}

export default SearchBar; 