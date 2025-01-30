import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { fetchApartmentTypes } from '../services/api';
import styled from 'styled-components';

const { Option } = Select;

// 스크롤 가능한 Select 스타일 커스터마이징
const StyledSelect = styled(Select)`
  .ant-select-selector {
    height: 32px;
    padding: 0 11px;
  }
  .ant-select-dropdown {
    max-height: 120px; // 약 3개의 아이템이 보이도록 설정
  }

  // 스크롤바 스타일링
  .rc-virtual-list-holder::-webkit-scrollbar {
    width: 6px;
  }
  
  .rc-virtual-list-holder::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .rc-virtual-list-holder::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  .rc-virtual-list-holder::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

function TypeSelector({ apartment, onSelect, selectedType }) {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (apartment?.complexNo) {
      const loadTypes = async () => {
        setLoading(true);
        try {
          const typesData = await fetchApartmentTypes(apartment.complexNo);
          setTypes(typesData.dataBody.data);
        } catch (error) {
          console.error('Failed to load types:', error);
        } finally {
          setLoading(false);
        }
      };
      loadTypes();
    } else {
      setTypes([]);
    }
  }, [apartment]);

  return (
    <StyledSelect
      style={{ width: 200 }}
      onChange={onSelect}
      value={selectedType}
      loading={loading}
      disabled={!apartment || loading}
      placeholder="평형 및 타입 선택"
      listHeight={120} // 드롭다운 높이 설정
      virtual={true} // 가상 스크롤 활성화
    >
      {types.map((type) => (
        <Option 
          key={type.면적일련번호} 
          value={type.면적일련번호}
          style={{ padding: '8px 12px' }}
        >
          {type.전용면적}㎡ ({type.공급면적}㎡)
        </Option>
      ))}
    </StyledSelect>
  );
}

export default TypeSelector; 