import React, { useState } from 'react';
import { fetchSearchResults, fetchApartmentDetails } from '../services/api';
import { Input, List } from 'antd';
import styled from 'styled-components';

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
`;

const ScrollableList = styled.div`
  position: absolute;
  z-index: 1000;
  width: 100%;
  max-height: 120px;
  overflow-y: auto;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin-top: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
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
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setIsSearching(true);
    try {
      const response = await fetchSearchResults(query);
      const searchData = response[0];
      const dataArray = searchData.COL_AT_HSCM;
      const formattedResults = dataArray.map(item => ({
        text: item.text,
        address: item.addr,
        displayName: item.textTemp
      }));
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
    setIsSearching(false);
    try {
      const details = await fetchApartmentDetails(result.displayName);
      const complexData = details.dataBody.data.data.HSCM.data[0];
      const apartmentData = {
        complexNo: complexData.COMPLEX_NO,
        apartmentName: complexData.HSCM_NM,
        address: complexData.BUBADDR,
      };
      onSelect(apartmentData);
      setQuery(result.displayName);
      setResults([]);
    } catch (error) {
      console.error('Error fetching apartment details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContainer>
      <Input.Search
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={handleSearch}
        onFocus={() => setIsSearching(true)}
        onBlur={() => setTimeout(() => setIsSearching(false), 200)}
        placeholder="아파트 이름을 입력하세요"
        loading={loading}
        enterButton
      />
      {isSearching && results.length > 0 && (
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
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {result.displayName}
              </List.Item>
            )}
          />
        </ScrollableList>
      )}
    </SearchContainer>
  );
}

export default SearchBar; 