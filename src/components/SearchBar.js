import React, { useState } from 'react';
import { fetchSearchResults, fetchApartmentDetails } from '../services/api';
import { Input, List } from 'antd';

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
      <List
        size="small"
        dataSource={results}
        renderItem={(result) => (
          <List.Item 
            onClick={() => handleSelect(result)}
            style={{ cursor: 'pointer' }}
          >
            {result.displayName}
          </List.Item>
        )}
      />
    </div>
  );
}

export default SearchBar; 